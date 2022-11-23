import { ApiConfigFile, S3Config } from '@dvp/api-interfaces';
import { checkEnv } from '@dvp/server-common';

checkEnv([
  'DOCUMENT_STORAGE_BUCKET_NAME',
  'S3_REGION',
  'API_URL',
  'CLIENT_URL',
]);

export const config: ApiConfigFile = {
  s3Config: {
    bucketName: process.env.DOCUMENT_STORAGE_BUCKET_NAME,
    clientConfig: {
      region: process.env.S3_REGION,
    },
  } as S3Config,
  apiURL: process.env.API_URL,
  clientURL: process.env.CLIENT_URL,
};
