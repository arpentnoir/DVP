import { KMSClientConfig } from '@aws-sdk/client-kms';
import { S3Config, StatusListS3Config } from '@dvp/api-interfaces';
import { checkEnv } from '@dvp/server-common';

checkEnv([
  'DOCUMENT_STORAGE_BUCKET_NAME',
  'API_URL',
  'CLIENT_URL',
  'AWS_REGION',
  'DYNAMODB_DOCUMENTS_TABLE',
  'KMS_KEY_ID',
  'REVOCATION_LIST_BUCKET_NAME',
  'REVOCATION_LIST_BIT_STRING_LENGTH',
]);

export interface DIDConfig {
  mnemonic: string;
}
export interface ApiConfig {
  awsRegion: string;
  apiURL: string;
  clientURL: string;
  didConfig: DIDConfig;
  dynamodb: {
    documentsTableName: string;
  };
  kms: {
    keyId: string;
    clientConfig: KMSClientConfig;
  };
  statusListS3Config: StatusListS3Config;
  s3Config: S3Config;
}

export const config: ApiConfig = {
  awsRegion: process.env.AWS_REGION,

  apiURL: process.env.API_URL,
  clientURL: process.env.CLIENT_URL,
  didConfig: {
    mnemonic:
      process.env.DID_MNEMONIC ||
      'coast lesson mountain spy inform deposit two trophy album endless party crumble base grape artefact',
  },
  kms: {
    keyId: process.env.KMS_KEY_ID,
    clientConfig: {
      region: process.env.AWS_REGION,
    },
  },
  dynamodb: {
    documentsTableName: process.env.DYNAMODB_DOCUMENTS_TABLE,
  },
  s3Config: {
    bucketName: process.env.DOCUMENT_STORAGE_BUCKET_NAME,
    clientConfig: {
      region: process.env.AWS_REGION,
    },
  } as S3Config,
  statusListS3Config: {
    bucketName: process.env.REVOCATION_LIST_BUCKET_NAME,
    clientConfig: {
      region: process.env.AWS_REGION,
    },
    bitStringLength: Number(process.env.REVOCATION_LIST_BIT_STRING_LENGTH),
  } as StatusListS3Config,
};