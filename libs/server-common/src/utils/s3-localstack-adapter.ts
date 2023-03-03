import { S3Config, StorageClient } from '@dvp/api-interfaces';
import { logger } from './logger';
import * as AWS from 'aws-sdk';

export class S3LocalstackAdapter implements StorageClient {
  private localstackS3Client: AWS.S3;
  private bucket: string;
  private basePath: string;

  constructor(providerConfig: S3Config, basePath = '') {
    this.bucket = providerConfig.bucketName;
    this.basePath = basePath;

		this.localstackS3Client = new AWS.S3({
			 endpoint: process.env['LOCALSTACK_ENDPOINT'],
       s3ForcePathStyle: true
		});
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
        await this.localstackS3Client.headObject(params).promise();
        return true;       
    } catch (err) {
      logger.debug(
        "[S3LocalstackAdapter.isObjectExists] object doesn't exist for %s: %s",
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
        const s3Object = await this.localstackS3Client.getObject(params).promise();
        if (s3Object?.Body) {
          return JSON.parse(
            s3Object.Body.toString()
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

  /**
   * Upload a payload to the configured S3 bucket.
   * 
   * @param objectPayload the payload to be uploaded
   * @param objectName the name of the payload to be uploaded
   * @returns name of the object uploaded to S3
   */
  async uploadObject(objectPayload: string, objectName: string) {   
   
    const uploadParams = {
      Bucket: this.bucket,
      Key: `${this.basePath}${objectName}`,
      Body: objectPayload,
    };

    await this.localstackS3Client.upload(uploadParams).promise();

    return objectName;
  }

  async deleteObject(objectName: string) {
    const deleteParams = {
      Bucket: this.bucket,
      Key: `${this.basePath}${objectName}`,
    };   
    await this.localstackS3Client?.deleteObject(deleteParams).promise();
  }

  async deleteDocument(documentId: string) {
    const deleteParams = {
      Bucket: this.bucket,
      Key: `${this.basePath}${documentId}`,
    };   
    await this.localstackS3Client?.deleteObject(deleteParams).promise();
  }
}
