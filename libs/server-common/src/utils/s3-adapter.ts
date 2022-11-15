import { S3Config, StorageClient } from '@dvp/api-interfaces';
import { S3 } from 'aws-sdk';

export class S3Adapter implements StorageClient {
  private client: S3;
  private bucket: string;

  constructor(providerConfig: S3Config) {
    this.bucket = providerConfig.bucketName;
    this.client = new S3(providerConfig.clientConfig);
  }

  async getDocument(documentId: string) {
    const params = { Bucket: this.bucket, Key: documentId };
    try {
      const encryptedDocument = await this.client.getObject(params).promise();
      if (encryptedDocument?.Body) {
        return JSON.parse(encryptedDocument.Body.toString());
      }
      return null;
    } catch (err: any) {
      if (err.message === 'The specified key does not exist.') {
        return null;
      }
      throw err;
    }
  }
}
