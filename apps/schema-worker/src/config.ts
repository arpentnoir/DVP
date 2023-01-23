import { checkEnv } from '@dvp/server-common';

checkEnv(['AWS_REGION', 'DYNAMODB_DOCUMENTS_TABLE']);

export interface ApiConfig {
  awsRegion: string;
  dynamodb: {
    documentsTableName: string;
  };
}

export const config: ApiConfig = {
  dynamodb: {
    documentsTableName: process.env.DYNAMODB_DOCUMENTS_TABLE,
  },
  awsRegion: process.env.AWS_REGION,
};
