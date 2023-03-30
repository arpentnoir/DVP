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

export const statusStorageClient: StorageClient = S3Adapter(
  config.statusListS3Config as S3Config
);

/**
 * This class handles operations on the Verifiable Credential revocation list.
 */
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

  /**
   * Returns a url representing an API endpoint for the given revocation list
   *
   * @param listCounter The name of the list we are generating a URL for (represented by a number)
   * @returns A string representation of the list URL.
   */
  generateListUrl(listCounter: number) {
    return `${config.apiURL}/credentials/status/${SVIPStatusRouteName}/${listCounter}`;
  }

  /**
   * Creates a new list for storing the revocation status of issued Verifiable Credentials. @see {@link https://w3c-ccg.github.io/vc-status-rl-2020/}
   *
   * In doing so, issues the first VC to be added to the list, and adds its default 'not revoked' status to the list. This list
   * is then uploaded to S3. A little further information on how revocation list works:
   *
   * Each revocation list has a name. This is referred to as listCounter. This number starts at 1, and is incremented whenver a new list is created.
   * Each revocation list has a max length (referred to as bitStringLength).
   * When adding a VC to the revocation list, we assign it a value of either 0 (NOT revoked) or 1 (Revoked).
   * A revocation list with a max length (bitStringLength) of 8 could look like this: 00101100.
   * Once max length is reached, the next issued VC triggers a new list to be created, and listCounter to be incremented,
   *
   * Note - this currently only applies to SVIP VCs.
   *
   * @param length The length of the list that will be created.
   * @param listCounter the name of the list that will be created (represented by a number).
   * @returns The newly created revocation list.
   */
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

  /**
   * Sets the revocation status for a Verifiable Credential.
   *
   * This value is set in DynamoDB, but for SVIP there is the additional step of writing to
   * the revocation list uploaded to S3.
   *
   * Gracefully rolls back in the case of error.
   *
   * @param credentialId Identifier of the verifiable credential to have its revocation status set.
   * @param credentialStatus The revocation status which will be written to the database and/or revocation list.
   * @returns
   */
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

  /**
   * Sets the revocation status for a given SVIP Verifiable Credential in the revocation list uploaded to S3.
   *
   * Retrieves the current revocation list before applying the update.
   *
   * @param document The document contained within the VC that is to have its revocation status set.
   * @param revoke Flag indicating if the credential is to be revoked.
   * @returns Both old and updated revocation lists. Returns both to assist with rollback, if required.
   */
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

      // Update the revocation list
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

  /**
   * Determines if adding a VC to the current revocation list will exceed the maximum allowed length (bitStringLength).
   * If so, create a new revocation list.
   */
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

  /**
   * Gets information about the current Verifiable Credential revocation list.
   * Creates a new revocation list of the
   *
   * @returns An object containing the current list index, the list s3 path, and the
   * list url
   */
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
