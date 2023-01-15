import { S3Config } from '@dvp/api-interfaces';
import { checkEnv } from '@dvp/server-common';

checkEnv([
  'DOCUMENT_STORAGE_BUCKET_NAME',
  'API_URL',
  'CLIENT_URL',
  'AWS_REGION',
  'DYNAMODB_DOCUMENTS_TABLE',
]);

export interface DIDConfig {
  mnemonic: string;
}
export interface ApiConfig {
  awsRegion: string;
  s3Config: S3Config;
  apiURL: string;
  clientURL: string;
  didConfig: DIDConfig;
  dynamodb: {
    documentsTableName: string;
  };
}

export const config: ApiConfig = {
  s3Config: {
    bucketName: process.env.DOCUMENT_STORAGE_BUCKET_NAME,
    clientConfig: {
      region: process.env.AWS_REGION,
    },
  } as S3Config,
  dynamodb: {
    documentsTableName: process.env.DYNAMODB_DOCUMENTS_TABLE,
  },
  awsRegion: process.env.AWS_REGION,
  apiURL: process.env.API_URL,
  clientURL: process.env.CLIENT_URL,
  didConfig: {
    mnemonic:
      process.env.DID_MNEMONIC ||
      'coast lesson mountain spy inform deposit two trophy album endless party crumble base grape artefact',
  },
};
