import { StorageClient } from '@dvp/api-interfaces';
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
    const documentObjectId = await storageClient.uploadDocument(
      JSON.stringify({
        document: encryptedDocument,
      }),
      id
    );
    return { documentId: documentObjectId, encryptionKey: key };
  }
}
