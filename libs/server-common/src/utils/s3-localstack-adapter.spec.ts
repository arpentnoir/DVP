import { S3LocalstackAdapter } from './s3-localstack-adapter';

const mockLocalstackS3Client = {
  upload: jest.fn().mockReturnThis(),
  headObject: jest.fn().mockReturnThis(),
  getObject: jest.fn().mockReturnThis(),
  deleteObject: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => {
  return { S3: jest.fn(() => mockLocalstackS3Client) };
});

const mockAwsProviderConfig = {
  bucketName: 'test',
  clientConfig: {
    region: 'test',
  },
};
   

describe('S3LocalstackAdapter', () => {
  const s3LocalstackAdapter = new S3LocalstackAdapter(mockAwsProviderConfig);
  mockLocalstackS3Client.promise.mockResolvedValue('mockResponse');

  it('should call getObject on the Localstack S3 client', async () => {    
    await s3LocalstackAdapter.getObject('objectId');
    expect(mockLocalstackS3Client.getObject).toHaveBeenCalledTimes(1);
  });

  it('should call headObject on the Localstack S3 client', async () => {    
    await s3LocalstackAdapter.isObjectExists('objectId');
    expect(mockLocalstackS3Client.headObject).toHaveBeenCalledTimes(1);
  });
  
  it('should call upload on the Localstack S3 client', async () => {    
    await s3LocalstackAdapter.uploadObject('payload', 'objectId');
    expect(mockLocalstackS3Client.upload).toHaveBeenCalledTimes(1);
  });

  it('should call deleteObject on the Localstack S3 client', async () => {    
    await s3LocalstackAdapter.deleteObject('objectId');
    expect(mockLocalstackS3Client.upload).toHaveBeenCalledTimes(1);
  });

});
