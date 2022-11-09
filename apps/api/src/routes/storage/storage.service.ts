import { StorageClient } from '@dvp/api-interfaces';
import { S3Adapter } from '../../utils';
import { config } from '../../config';

export const storageClient: StorageClient = new S3Adapter(config.s3Config);

export const getDocument = async (
  storageClient: StorageClient,
  documentId: string
) => {
  return await storageClient.getDocument(documentId);
};
