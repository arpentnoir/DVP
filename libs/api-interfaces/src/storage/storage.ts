import { S3ClientConfig } from '@aws-sdk/client-s3';

export interface S3Config {
  bucketName: string;
  clientConfig: S3ClientConfig;
}

export interface StorageClient {
  getDocument(
    documentId: string
  ): Promise<{ document: EncryptedDocument } | null>;
  isDocumentExists(documentId: string): Promise<boolean>;
  uploadDocument(document: string, documentId: string): Promise<string>;
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
