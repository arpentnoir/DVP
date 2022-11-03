import * as aws from '@pulumi/aws';
import { pulumiStack } from './config';

// Policies will be added when endpoint is created
export const storageApiBucket = new aws.s3.Bucket(`${pulumiStack}-storageApi`, {
  bucket: `${pulumiStack}-storage-api`,
});
