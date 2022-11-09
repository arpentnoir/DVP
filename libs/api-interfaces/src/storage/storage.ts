import { S3 } from 'aws-sdk';

export interface S3Config {
  bucketName: string;
  clientConfig: S3.ClientConfiguration;
}

export interface StorageClient {
  getDocument(documentId: string): Promise<EncryptedDocument>;
}

export interface EncryptedDocument {
  cipherText: string;
  iv: string;
  tag: string;
  type: string;
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
