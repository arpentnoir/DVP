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

export const storageClient: StorageClient = new S3Adapter(config.s3Config);

export class StorageService {
  logger: Logger;
  invocationContext: RequestInvocationContext;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
  }

  async getDocument(storageClient: StorageClient, documentId: string) {
    const documentObject = await storageClient.getDocument(documentId);
    return documentObject?.document;
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

  async uploadDocument(
    storageClient: StorageClient,
    document: string,
    documentId?: string,
    encryptionKey?: string
  ) {
    const key = encryptionKey || generateEncryptionKey();
    const id = documentId || getUuId();

    const encryptedDocument = encryptString(document, key);
    if (await storageClient.isDocumentExists(id)) {
      throw new ValidationError('documentId', id);
    }

    // When a VC is fetched from storage, the consumer must have the
    // corresponding key to decrypt the document
    delete encryptedDocument.key;

    const documentObjectId = await storageClient.uploadDocument(
      JSON.stringify({
        document: encryptedDocument,
      }),
      id
    );
    return { documentId: documentObjectId, encryptionKey: key };
  }
}
