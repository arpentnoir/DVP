import { StorageClient } from '@dvp/api-interfaces';
import {
  Logger,
  RequestInvocationContext,
  S3Adapter,
} from '@dvp/server-common';
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
    return storageClient.getDocument(documentId);
  }
}
