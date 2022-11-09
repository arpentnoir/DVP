export * from './storage/storage';
export * from './lib/api-interfaces';
import { S3Config } from './storage/storage';

export interface ApiConfigFile {
  s3Config: S3Config;
}
