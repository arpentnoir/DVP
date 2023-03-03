import {
  CredentialStatus,
  IssueCredentialRequestSigningMethodEnum,
} from '@dvp/api-client';
import {
  S3Config,
  StorageClient,
  VerifiableCredential,
} from '@dvp/api-interfaces';
import {
  ApplicationError,
  Logger,
  NotFoundError,
  RequestInvocationContext,
  S3Adapter,
} from '@dvp/server-common';
import {
  createCredential,
  createList,
  decodeList,
} from '@transmute/vc-status-rl-2020';
import { config } from '../../config';
import { models } from '../../db';
import { IssueService } from '../credentials/issue/issue.service';
import { StorageService } from '../storage/storage.service';

const IS_REVOKED = '1';

export const statusStorageClient: StorageClient = S3Adapter(
  config.statusListS3Config as S3Config
);

export class StatusService {
  logger: Logger;
  invocationContext: RequestInvocationContext;
  bitStringLength: number;
  storageService: StorageService;
  issueService: IssueService;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
    this.bitStringLength = config.statusListS3Config.bitStringLength;
    this.storageService = new StorageService(this.invocationContext);
    this.issueService = new IssueService(this.invocationContext);
  }

  generateListUrl(listCounter: number) {
    return `${config.apiURL}/status/${listCounter}`;
  }

  async createRevocationListVC(
    length: number,
    listCounter: number
  ): Promise<VerifiableCredential> {
    try {
      const id = this.generateListUrl(listCounter);
      const list = await createList({ length });
      const credentialList = await createCredential({ id, list });

      // Issue RevocationList VC
      const { verifiableCredential: revocationList } =
        await this.issueService.baseIssue(
          IssueCredentialRequestSigningMethodEnum.Svip,
          {
            ...credentialList,
            // TODO Confirm issuer
            issuer: 'dvp-example',
            issuanceDate: new Date().toISOString(),
          },
          false
        );

      // Store RevocationList VC to S3
      await this.storageService.uploadDocument({
        storageClient: statusStorageClient,
        document: JSON.stringify(revocationList) as unknown as string,
        documentId: `${listCounter}`,
        encryptionKey: undefined,
        encryptData: false,
      });

      return revocationList;
    } catch (err) {
      this.logger.debug(
        '[Revocation.createRevocationListVC] Failed to create revocation list, %o',
        err
      );
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(`Failed to create revocation list`);
    }
  }

  async setStatus(credentialId: string, credentialStatus: CredentialStatus[]) {
    try {
      const { userAbn } = this.invocationContext;

      const revokeStatus = credentialStatus[0].status === IS_REVOKED;

      const credential = await models.Document.get({
        id: credentialId,
        abn: userAbn,
      });

      if (!credential) {
        throw new NotFoundError(credentialId);
      } else if (
        !credential.revocationS3Path ||
        credential.revocationIndex == undefined
      ) {
        throw new Error(
          'Verifiable Credential does not contain revocationIndex and revocationS3Path'
        );
      }

      // Retrieve RevocationList VC from S3
      const revocationListVC =
        await this.storageService.getDocument<VerifiableCredential>(
          statusStorageClient,
          credential.revocationS3Path
        );

      const list = await decodeList({
        encodedList: revocationListVC.credentialSubject.encodedList,
      });

      list.setRevoked(credential.revocationIndex, revokeStatus);

      const updateRevocationList = await createCredential({
        id: revocationListVC.id,
        list,
      });

      const { verifiableCredential: updatedRevocationList } =
        await this.issueService.baseIssue(
          IssueCredentialRequestSigningMethodEnum.Svip,
          {
            ...updateRevocationList,
            issuer: 'dvp-example',
            issuanceDate: new Date().toISOString(),
          },
          false
        );

      await models.Document.update({
        id: credentialId,
        abn: userAbn,
        isRevoked: revokeStatus,
      });

      // Store updated RevocationList VC back to S3
      await this.storageService.uploadDocument({
        storageClient: statusStorageClient,
        document: JSON.stringify(updatedRevocationList),
        documentId: credential.revocationS3Path,
        encryptionKey: undefined,
        encryptData: false,
        overwrite: true,
      });

      return updateRevocationList;
    } catch (err) {
      this.logger.debug(
        '[Revocation.setStatus] Failed to set verification credential status, %o',
        err
      );
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(
        `Failed to set verification credential status`
      );
    }
  }

  async updateRevocationListData() {
    try {
      const revocationCounter = await models.RevocationCounter.get(
        {},
        { limit: 1 }
      );

      let counter = revocationCounter.counter + 1;
      let listCounter: number = revocationCounter.listCounter;

      // If bit string length is reached, create a new revocation list vc
      if (counter >= this.bitStringLength) {
        counter = 0;
        listCounter += 1;

        await this.createRevocationListVC(this.bitStringLength, listCounter);
      }

      await models.RevocationCounter.update({
        counter,
        listCounter,
      });
    } catch (err) {
      this.logger.debug(
        '[Revocation.updateRevocationListData] Failed update revocationList data, %o',
        err
      );
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(`Failed to update revocationList data`);
    }
  }

  async getRevocationListData() {
    try {
      // There's only ever one entry for RevocationCounter
      let revocationCounter = await models.RevocationCounter.get(
        {},
        { limit: 1 }
      );

      const bitStringLengthHasChanged =
        revocationCounter &&
        revocationCounter.bitStringLength !== this.bitStringLength;

      // If revocationCounter does not exist, create one.
      // When the bit string length is changed in config
      // A new list must be created to reflect the change.
      if (!revocationCounter || bitStringLengthHasChanged) {
        const listCounter = bitStringLengthHasChanged
          ? revocationCounter.listCounter + 1
          : 1;
        const counter = 0;

        revocationCounter = await models.RevocationCounter.update(
          {
            counter,
            listCounter,
            bitStringLength: this.bitStringLength,
          },
          // Create if does not exist
          {
            exists: !!revocationCounter,
          }
        );

        await this.createRevocationListVC(this.bitStringLength, listCounter);
      }

      return {
        index: revocationCounter.counter,
        listUrl: this.generateListUrl(revocationCounter.listCounter),
        s3Path: `${revocationCounter.listCounter}`,
      };
    } catch (err) {
      this.logger.debug(
        '[Revocation.getRevocationListData] Failed to get revocationList data, %o',
        err
      );
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(`Failed to get revocationList data`);
    }
  }
}
