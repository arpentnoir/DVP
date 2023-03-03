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
  DocumentType,
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
import { SVIPStatusRouteName } from '.';
import { config } from '../../../config';
import { models } from '../../../db';
import { StorageService } from '../../storage/storage.service';
import { IssueService } from '../issue/issue.service';

const IS_REVOKED = '1';

export const statusStorageClient: StorageClient = new S3Adapter(
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
    return `${config.apiURL}/credentials/status/${SVIPStatusRouteName}/${listCounter}`;
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
          // Casting to any as issuer will be injected when credential is issued
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          {
            ...credentialList,
            issuanceDate: new Date().toISOString(),
          } as any,
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

  async setRevocationStatus(
    credentialId: string,
    credentialStatus: CredentialStatus[]
  ) {
    try {
      let oldRevocationList: VerifiableCredential;
      let newRevocationList: VerifiableCredential;

      const revokeStatus = credentialStatus[0].status === IS_REVOKED;

      const { userAbn } = this.invocationContext;

      const credential = await models.Document.get({
        id: credentialId,
        abn: userAbn,
      });

      const oldStatus = credential.isRevoked;

      if (!credential) {
        throw new NotFoundError(credentialId);
      }

      // SVIP VCs require an additional step of updating and publishing revocationList VC
      if (
        credential.signingMethod ===
        IssueCredentialRequestSigningMethodEnum.Svip
      ) {
        const res = await this.setSvipRevocationStatus(
          credential,
          revokeStatus
        );

        oldRevocationList = res.oldRevocationList;
        newRevocationList = res.newRevocationList;
      }

      try {
        await models.Document.update({
          id: credentialId,
          abn: userAbn,
          isRevoked: revokeStatus,
        });
      } catch (err) {
        // Since database update has failed, re-publish old revocationList to maintain consistency
        if (
          credential.signingMethod ===
          IssueCredentialRequestSigningMethodEnum.Svip
        ) {
          await this.storageService.uploadDocument({
            storageClient: statusStorageClient,
            document: JSON.stringify(oldRevocationList),
            documentId: `${credential.revocationS3Path}`,
            encryptionKey: undefined,
            encryptData: false,
            overwrite: true,
          });
        }

        this.logger.fatal(
          '[Revocation.setRevocationStatus] Failed to update status in database, %o, %o',
          err,
          {
            oldStatus,
            newStatus: revokeStatus,
          }
        );

        throw err;
      }

      return newRevocationList;
    } catch (err) {
      this.logger.debug(
        '[Revocation.setRevocationStatus] Failed to set verification credential status, %o',
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

  async setSvipRevocationStatus(document: DocumentType, revoke: boolean) {
    try {
      if (!document.revocationS3Path || document.revocationIndex == undefined) {
        throw new Error(
          'SVIP Verifiable Credential does not contain revocationIndex and revocationS3Path'
        );
      }

      // Retrieve RevocationList VC from S3
      const oldRevocationList =
        await this.storageService.getDocument<VerifiableCredential>(
          statusStorageClient,
          document.revocationS3Path
        );

      const list = await decodeList({
        encodedList: oldRevocationList.credentialSubject.encodedList,
      });

      list.setRevoked(document.revocationIndex, revoke);

      const updatedRevocationList = await createCredential({
        id: oldRevocationList.id,
        list,
      });

      const { verifiableCredential: newRevocationList } =
        await this.issueService.baseIssue(
          IssueCredentialRequestSigningMethodEnum.Svip,
          // Casting to any as issuer will be injected when credential is issued
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          {
            ...updatedRevocationList,
            issuanceDate: new Date().toISOString(),
          } as any,
          false
        );

      // Store updated RevocationList VC back to S3
      await this.storageService.uploadDocument({
        storageClient: statusStorageClient,
        document: JSON.stringify(newRevocationList),
        documentId: document.revocationS3Path,
        encryptionKey: undefined,
        encryptData: false,
        overwrite: true,
      });

      // Returning oldRevocationList in case reversion is needed
      return { oldRevocationList, newRevocationList };
    } catch (err) {
      this.logger.debug(
        '[Revocation.setSvipRevocationStatus] Failed to set SVIP verification credential status, %o',
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
