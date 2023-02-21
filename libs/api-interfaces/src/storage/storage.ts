import { S3ClientConfig } from '@aws-sdk/client-s3';

export interface S3Config {
  bucketName: string;
  clientConfig: S3ClientConfig;
}

export interface StatusListS3Config extends S3Config {
  bitStringLength: number;
}

export interface StorageClient {
  getBasePath(): string;
  getObject<ObjectType>(objectName: string): Promise<ObjectType | null>;
  isObjectExists(objectName: string): Promise<boolean>;
  uploadObject(objectPayload: string, objectName: string): Promise<string>;
  deleteObject(documentId: string): Promise<void>;
}

export interface EncryptedDocument {
  cipherText: string;
  iv: string;
  tag: string;
  type: string;
}

export interface EncryptedDocumentObject {
  document: EncryptedDocument;
}

export interface ErrorObject {
  id?: string;
  code: string;
  detail: string;
  source?: {
    pointer?: string;
    location?: 'REQUEST' | 'QUERY' | 'ID';
    parameter?: string;
  };
  helpUrl?: string;
  helpText?: string;
}

export type QRPayload = {
  payload: {
    uri: string;
    key: string;
  };
};
