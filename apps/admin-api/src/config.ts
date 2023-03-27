import { checkEnv } from '@dvp/server-common';

checkEnv(['API_URL', 'AWS_REGION', 'DYNAMODB_DOCUMENTS_TABLE']);

export interface DIDConfig {
  mnemonic: string;
}
export interface ApiConfig {
  awsRegion: string;
  apiURL: string;
  apiInternalPath: string;
  dynamodb: {
    documentsTableName: string;
  };
}

export const config: ApiConfig = {
  dynamodb: {
    documentsTableName: process.env.DYNAMODB_DOCUMENTS_TABLE,
  },
  awsRegion: process.env.AWS_REGION,
  apiURL: process.env.API_URL,
  apiInternalPath: process.env.API_INTERNAL_PATH || '/v1',
};
