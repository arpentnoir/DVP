export * from './storage';
export * from './vc';
export * from './verify';

import { S3Config } from './storage';

export interface ApiConfigFile {
  s3Config: S3Config;
}
