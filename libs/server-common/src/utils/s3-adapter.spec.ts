import { StorageClient } from '@dvp/api-interfaces';
import { S3Adapter } from './s3-adapter';
import { S3AWSAdapter } from './s3-aws-adapter';
import { S3LocalstackAdapter } from './s3-localstack-adapter';

describe('S3Adapter', () => {

  const mockS3ProviderConfig = {
    bucketName: 'test',
    clientConfig: {
      region: 'test',
    },
  };  

  it('should return an instance of the S3 Localstack Adapter if the Localstack environment flag is set to true', () => {
    process.env['ENABLE_LOCALSTACK'] = 'true';
    const s3Client: StorageClient = S3Adapter(mockS3ProviderConfig);
    expect(s3Client).toBeInstanceOf(S3LocalstackAdapter);
  });

  it('should return an instance of the S3 AWS Adapter if Localstack environment flag is not set', () => {
    process.env['ENABLE_LOCALSTACK'] = undefined;
    const s3Client: StorageClient = S3Adapter(mockS3ProviderConfig);
    expect(s3Client).toBeInstanceOf(S3AWSAdapter);
  });
  
});
