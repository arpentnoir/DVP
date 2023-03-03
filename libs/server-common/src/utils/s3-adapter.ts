import { S3Config } from '@dvp/api-interfaces';
import { S3AWSAdapter } from './s3-aws-adapter';
import { S3LocalstackAdapter } from './s3-localstack-adapter';
import { StorageClient } from '@dvp/api-interfaces';

export const S3Adapter = (providerConfig: S3Config, basePath?: string): StorageClient => {  
  if (process.env['ENABLE_LOCALSTACK'] === 'true') {    
    return new S3LocalstackAdapter(providerConfig, basePath);
  } else{
    return new S3AWSAdapter(providerConfig, basePath);
  }
};

