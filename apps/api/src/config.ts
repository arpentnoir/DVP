import { S3Config } from '@dvp/api-interfaces';
import { checkEnv } from '@dvp/server-common';

checkEnv([
  'DOCUMENT_STORAGE_BUCKET_NAME',
  'S3_REGION',
  'API_URL',
  'CLIENT_URL',
]);

export interface DIDConfig {
  mnemonic: string;
}
export interface ApiConfig {
  s3Config: S3Config;
  apiURL: string;
  clientURL: string;
  didConfig: DIDConfig;
}

export const config: ApiConfig = {
  s3Config: {
    bucketName: process.env.DOCUMENT_STORAGE_BUCKET_NAME,
    clientConfig: {
      region: process.env.S3_REGION,
    },
  } as S3Config,
  apiURL: process.env.API_URL,
  clientURL: process.env.CLIENT_URL,
  didConfig: {
    mnemonic:
      process.env.DID_MNEMONIC ||
      'coast lesson mountain spy inform deposit two trophy album endless party crumble base grape artefact',
  },
};
