import { IssueCredentialRequestSigningMethodEnum } from '@dvp/api-client';
import {
  DocumentMetadata,
  IssuedDocument,
  IssuerFunction,
  VerifiableCredential,
} from '@dvp/api-interfaces';
import {
  ApplicationError,
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
import { storageClient, StorageService } from '../../storage/storage.service';

export class IssueService {
  logger: Logger;
  invocationContext: RequestInvocationContext;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
  }

  // Currently only OpenAttestation is supported
  getIssuer(
    signingMethod: IssueCredentialRequestSigningMethodEnum,
    credential: VerifiableCredential
  ): IssuerFunction {
    if (signingMethod === IssueCredentialRequestSigningMethodEnum.Oa) {
      return openAttestation.issueCredential;
    } else if (signingMethod === IssueCredentialRequestSigningMethodEnum.Svip) {
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

  async storeMetadata(
    credential: VerifiableCredential,
    documentId: string,
    decryptionKey: string,
    documentStorePath: string
  ): Promise<void> {
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

      await models.Document.create({
        id: documentId,
        createdBy: userId,
        abn: userAbn,
        s3Path: `${documentStorePath}${documentId}`,
        decryptionKey,
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
      // Generate a storage url with the id and key and attach to credential
      const storageService = new StorageService(this.invocationContext);

      const { documentStorePath } = storageService;
      const { credentialWithQrUrl, documentId, encryptionKey } =
        storageService.embedQrUrl(credential);

      // Issue the verifiable credential
      const issuer = this.getIssuer(signingMethod, credentialWithQrUrl);

      // Temporarily hardcoding verificationMethod and key
      const issuerKeyId =
        'did:ethr:0x4Bf4190a27A37d1677c8ADE25b53F1e22885531f#controller';
      const privateKey =
        '0x17036c69d211cb39dea5fa0ab71aa2b55797ae4506062ff878a82e52575b97c0';

      const verifiableCredential = await issuer(
        credentialWithQrUrl,
        issuerKeyId,
        privateKey
      );

      // Store the issued verifiable credential
      await storageService.uploadDocument(
        storageClient,
        JSON.stringify(verifiableCredential),
        documentId,
        encryptionKey
      );

      // Store the metadata of the issued verifiable credential
      await this.storeMetadata(
        verifiableCredential,
        documentId,
        encryptionKey,
        documentStorePath
      );

      return {
        verifiableCredential,
        documentId,
        encryptionKey,
      };
    } catch (err: unknown) {
      this.logger.debug(
        '[IssueService.issue] Failed to issue verifiable credential, %o',
        err
      );
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(`Failed to issue verifiable credential`);
    }
  }
}
