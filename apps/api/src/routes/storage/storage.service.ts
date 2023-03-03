import {
  QRPayload,
  StorageClient,
  VerifiableCredential,
} from '@dvp/api-interfaces';
import {
  getUuId,
  Logger,
  RequestInvocationContext,
  S3Adapter,
  ValidationError,
} from '@dvp/server-common';
import { encryptString, generateEncryptionKey } from '@govtechsg/oa-encryption';
import { config } from '../../config';

const DOCUMENTS_BASE_PATH = 'documents/';

export interface IUploadDocument {
  storageClient: StorageClient;
  document: string;
  documentId?: string;
  encryptionKey?: string;
  encryptData?: boolean;
  overwrite?: boolean;
}

export const storageClient: StorageClient = S3Adapter(
  config.s3Config,
  DOCUMENTS_BASE_PATH
);

export class StorageService {
  logger: Logger;
  invocationContext: RequestInvocationContext;
  documentStorePath: string;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
    this.documentStorePath = storageClient.getBasePath();
  }

  async deleteDocument(storageClient: StorageClient, documentId: string) {
    try {
      await storageClient.deleteObject(documentId);
    } catch (err: unknown) {
      this.logger.debug(
        '[StorageService.deleteDocument] Failed to delete the verifiable credential, %o',
        err
      );
      throw new Error('Failed to delete the verifiable credential');
    }
  }

  async getDocument<DocumentType>(
    storageClient: StorageClient,
    documentId: string
  ): Promise<DocumentType> {
    const documentObject = await storageClient.getObject<DocumentType>(
      documentId
    );

    return documentObject;
  }

  embedQrUrl(verifiableCredential: VerifiableCredential) {
    try {
      const { qrUrl, id, key } = this.generateQrUrl();

      const credentialWithQrUrl = JSON.parse(
        JSON.stringify(verifiableCredential)
      ) as VerifiableCredential;

      credentialWithQrUrl.credentialSubject.links = {
        self: {
          href: qrUrl,
        },
      };

      return { credentialWithQrUrl, documentId: id, encryptionKey: key };
    } catch (err: unknown) {
      this.logger.debug(
        '[StorageService.embedQrUrl] Failed to attach QR URL to credential, %o',
        err
      );

      throw new Error('Failed to attach QR URL to credential');
    }
  }

  generateQrUrl(documentId?: string, encryptionKey?: string) {
    try {
      const key = encryptionKey || generateEncryptionKey();
      const id = documentId || getUuId();

      const uri = `${config.apiURL}/storage/documents/${id}`;

      const payload: QRPayload = {
        payload: {
          uri,
          key,
        },
      };

      const qrUrl = `${config.clientURL}/verify?q=${encodeURIComponent(
        JSON.stringify(payload)
      )}`;

      return { qrUrl, id, key };
    } catch (err: unknown) {
      this.logger.debug(
        '[StorageService.generateQrUrl] Failed to generate QR URL, %o',
        err
      );

      throw new Error('Failed to generate QR URL');
    }
  }

  async uploadDocument({
    storageClient,
    document,
    documentId,
    encryptionKey,
    encryptData = true,
    overwrite = false,
  }: IUploadDocument) {
    const key = encryptionKey || generateEncryptionKey();
    const id = documentId || getUuId();

    let payload = document;

    if (encryptData) {
      const encryptedDocument = encryptString(document, key);

      // When a VC is fetched from storage, the consumer must have the
      // corresponding key to decrypt the document
      delete encryptedDocument.key;

      payload = JSON.stringify({ document: encryptedDocument });
    }

    if (!overwrite && (await storageClient.isObjectExists(id))) {
      throw new ValidationError('documentId', id);
    }

    const documentObjectId = await storageClient.uploadObject(payload, id);

    return encryptData
      ? { documentId: documentObjectId, encryptionKey: key }
      : { documentId: documentObjectId };
  }
}
