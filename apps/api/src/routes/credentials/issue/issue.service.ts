import { IssueCredentialRequestSigningMethodEnum } from '@dvp/api-client';
import {
  DocumentMetadata,
  IssuedDocument,
  IssuerFunction,
  VerifiableCredential,
} from '@dvp/api-interfaces';
import {
  ApplicationError,
  getUuId,
  isGenericDocument,
  Logger,
  openAttestation,
  RequestInvocationContext,
  transmute,
  ValidationError,
} from '@dvp/server-common';
import { isUndefined, omitBy } from 'lodash';
import { config } from '../../../config';
import { models } from '../../../db';
import { StatusService } from '../../status/status.service';
import { storageClient, StorageService } from '../../storage/storage.service';

export interface IMetaData {
  credential: VerifiableCredential;
  documentId: string;
  decryptionKey: string;
  documentStorePath: string;
  revocationIndex?: number;
  revocationS3Path?: string;
}

export class IssueService {
  logger: Logger;
  invocationContext: RequestInvocationContext;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
  }

  generateCredentialId(uuid?: string) {
    return `urn:uuid:${uuid ?? getUuId()}`;
  }

  getIssuer(
    signingMethod: IssueCredentialRequestSigningMethodEnum,
    credential: VerifiableCredential
  ): IssuerFunction {
    if (signingMethod === IssueCredentialRequestSigningMethodEnum.Oa) {
      return openAttestation.issueCredential;
    } else if (
      // Default to SVIP if signingMethod is not provided
      signingMethod === IssueCredentialRequestSigningMethodEnum.Svip ||
      !signingMethod
    ) {
      return (credential) =>
        transmute.issueCredential({
          credential: credential as VerifiableCredential,
          mnemonic: config.didConfig.mnemonic,
        }) as Promise<VerifiableCredential>;
    } else {
      this.logger.debug(
        '[IssuerService.getIssuer] Unknown credential type found, %o',
        signingMethod,
        credential
      );

      throw new ValidationError('signingMethod', signingMethod);
    }
  }

  async storeMetadata({
    credential,
    documentId,
    decryptionKey,
    documentStorePath,
    revocationIndex,
    revocationS3Path,
  }: IMetaData): Promise<void> {
    try {
      const { userId, userAbn } = this.invocationContext;

      const { issuanceDate, expirationDate } = credential;
      const {
        iD,
        freeTradeAgreement,
        importingJurisdiction,
        exporterOrManufacturerAbn,
        importerName,
        consignmentReferenceNumber,
        documentDeclaration,
        supplyChainConsignment,
      } = credential.credentialSubject;

      const documentMetadata: DocumentMetadata = isGenericDocument(credential)
        ? {
            documentNumber: iD,
            freeTradeAgreement,
            importingJurisdiction,
            exporterOrManufacturerAbn,
            importerName,
            consignmentReferenceNumber,
            documentDeclaration,
            issueDate: issuanceDate,
            expiryDate: expirationDate,
          }
        : {
            documentNumber: iD,
            importingJurisdiction: supplyChainConsignment?.importCountry?.name,
            exporterOrManufacturerAbn: supplyChainConsignment?.consignor?.iD,
            importerName: supplyChainConsignment?.consignee?.name,
            consignmentReferenceNumber: supplyChainConsignment?.iD,
            issueDate: issuanceDate,
            expiryDate: expirationDate,
          };

      const filteredDocumentMetadata: DocumentMetadata = omitBy(
        documentMetadata,
        isUndefined
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await models.Document.create({
        id: documentId,
        createdBy: userId,
        abn: userAbn,
        s3Path: `${documentStorePath}${documentId}`,
        decryptionKey,
        revocationIndex,
        revocationS3Path,
        ...filteredDocumentMetadata,
      });
    } catch (err: unknown) {
      this.logger.debug(
        '[IssueService.storeMetadata] Failed to store the verifiable credentials metadata, %o',
        err
      );
      const storageService = new StorageService(this.invocationContext);
      await storageService.deleteDocument(storageClient, documentId);

      throw new ApplicationError(
        'Failed to store the verifiable credentials metadata'
      );
    }
  }

  async issue(
    signingMethod: IssueCredentialRequestSigningMethodEnum,
    credential: VerifiableCredential
  ): Promise<IssuedDocument> {
    try {
      let issueResult: IssuedDocument;

      // Defaults to SVIP
      if (signingMethod === IssueCredentialRequestSigningMethodEnum.Oa) {
        issueResult = await this.baseIssue(signingMethod, credential, true);
      } else {
        issueResult = await this.issueWithStatus(signingMethod, credential);
      }

      return issueResult;
    } catch (err) {
      this.logger.debug(
        '[IssueService.baseIssue] Failed to issue verifiable credential, %o',
        err
      );
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(`Failed to issue verifiable credential`);
    }
  }

  async issueWithStatus(
    signingMethod: IssueCredentialRequestSigningMethodEnum,
    credential: VerifiableCredential
  ): Promise<IssuedDocument> {
    try {
      const statusService = new StatusService(this.invocationContext);
      const { index, listUrl, s3Path } =
        await statusService.getRevocationListData();

      credential.credentialStatus = {
        id: listUrl,
        type: 'RevocationList2020Status',
        revocationListIndex: index.toString(),
        revocationListCredential: listUrl,
      };

      const issueResult = await this.baseIssue(
        signingMethod,
        credential,
        true,
        index,
        s3Path
      );

      await statusService.updateRevocationListData();

      return issueResult;
    } catch (err: unknown) {
      this.logger.debug(
        '[IssueService.issueWithStatus] Failed to issue verifiable credential with status, %o',
        err
      );
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(
        `Failed to issue verifiable credential with status`
      );
    }
  }

  async baseIssue(
    signingMethod: IssueCredentialRequestSigningMethodEnum,
    credential: VerifiableCredential,
    generateQrUrl = true,
    revocationIndex?: number,
    revocationS3Path?: string
  ): Promise<IssuedDocument> {
    try {
      // Generate a storage url with the id and key and attach to credential
      const storageService = new StorageService(this.invocationContext);

      const { documentStorePath } = storageService;

      let credentialToIssue = credential;
      let documentId: string;
      let encryptionKey: string;

      if (generateQrUrl) {
        const {
          credentialWithQrUrl,
          documentId: docId,
          encryptionKey: encKey,
        } = storageService.embedQrUrl(credential);

        credentialToIssue = credentialWithQrUrl;
        documentId = docId;
        encryptionKey = encKey;

        // We always generate unique id for VCs
        // The only exception is RevocationList VC which will not
        // include a QRUrl
        credentialToIssue.id = this.generateCredentialId(documentId);
      }

      // Issue the verifiable credential
      const issuer = this.getIssuer(signingMethod, credentialToIssue);

      // Temporarily hardcoding verificationMethod and key
      const issuerKeyId =
        'did:ethr:0x4Bf4190a27A37d1677c8ADE25b53F1e22885531f#controller';
      const privateKey =
        '0x17036c69d211cb39dea5fa0ab71aa2b55797ae4506062ff878a82e52575b97c0';

      const verifiableCredential = await issuer(
        credentialToIssue,
        issuerKeyId,
        privateKey
      );

      if (generateQrUrl) {
        // Store the issued verifiable credential
        await storageService.uploadDocument({
          storageClient,
          document: JSON.stringify(verifiableCredential),
          documentId,
          encryptionKey,
        });

        // Store the metadata of the issued verifiable credential
        await this.storeMetadata({
          credential: verifiableCredential,
          documentId,
          decryptionKey: encryptionKey,
          documentStorePath,
          revocationIndex,
          revocationS3Path,
        });
      }

      return {
        verifiableCredential,
        documentId,
        encryptionKey,
      };
    } catch (err: unknown) {
      this.logger.debug(
        '[IssueService.baseIssue] Failed to issue verifiable credential, %o',
        err
      );
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(`Failed to issue verifiable credential`);
    }
  }
}
