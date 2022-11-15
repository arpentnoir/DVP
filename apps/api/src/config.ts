import { ApiConfigFile, S3Config } from '@dvp/api-interfaces';
import { getEnv } from '@dvp/server-common';

getEnv(['DOCUMENT_STORAGE_BUCKET_NAME', 'S3_REGION']) as S3Config;

export const config: ApiConfigFile = {
  s3Config: {
    bucketName: process.env.DOCUMENT_STORAGE_BUCKET_NAME,
    clientConfig: {
      region: process.env.S3_REGION,
    },
  } as S3Config,
};
