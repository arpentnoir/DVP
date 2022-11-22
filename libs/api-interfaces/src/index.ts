export * from './storage';
export * from './vc';
export * from './verify';
export * from './issue';

import { S3Config } from './storage';

export interface ApiConfigFile {
  s3Config: S3Config;
}
