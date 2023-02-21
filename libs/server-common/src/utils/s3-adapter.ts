import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { S3Config, StorageClient } from '@dvp/api-interfaces';
import { logger } from './logger';

export class S3Adapter implements StorageClient {
  private s3Client: S3Client;
  private bucket: string;
  private basePath: string;

  constructor(providerConfig: S3Config, basePath = '') {
    this.bucket = providerConfig.bucketName;
    this.s3Client = new S3Client(providerConfig.clientConfig);
    this.basePath = basePath;
  }

  getBasePath() {
    return this.basePath;
  }

  async isObjectExists(objectName: string) {
    const params = {
      Bucket: this.bucket,
      Key: `${this.basePath}${objectName}`,
    };

    try {
      await this.s3Client.send(new HeadObjectCommand(params));
      return true;
    } catch (err) {
      logger.debug(
        "[S3Adapter.isObjectExists] object doesn't exist for %s: %s",
        objectName,
        err
      );
      return false;
    }
  }

  async getObject<ObjectType>(objectName: string) {
    const params = {
      Bucket: this.bucket,
      Key: `${this.basePath}${objectName}`,
    };

    try {
      const s3Object = await this.s3Client.send(new GetObjectCommand(params));

      if (s3Object?.Body) {
        return JSON.parse(
          await s3Object.Body.transformToString()
        ) as ObjectType;
      }
      return null;
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err?.message === 'The specified key does not exist.'
      ) {
        return null;
      }
      throw err;
    }
  }

  async uploadObject(objectPayload: string, objectName: string) {
    const params: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: `${this.basePath}${objectName}`,
      Body: objectPayload,
    };
    await this.s3Client.send(new PutObjectCommand(params));
    return objectName;
  }

  async deleteObject(objectName: string) {
    const params: DeleteObjectCommandInput = {
      Bucket: this.bucket,
      Key: `${this.basePath}${objectName}`,
    };
    await this.s3Client.send(new DeleteObjectCommand(params));
  }

  async deleteDocument(documentId: string) {
    const params: DeleteObjectCommandInput = {
      Bucket: this.bucket,
      Key: `${this.basePath}${documentId}`,
    };
    await this.s3Client.send(new DeleteObjectCommand(params));
  }
}
