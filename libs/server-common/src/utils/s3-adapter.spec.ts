const mockS3Promise = jest.fn();
const mockS3GetObject = jest.fn(() => ({
  promise: mockS3Promise,
}));

const mockAwsProviderConfig = {
  bucketName: 'test',
  clientConfig: {
    region: 'test',
  },
};

jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => ({
    getObject: mockS3GetObject,
  })),
}));

import { S3Adapter } from './s3-adapter';

const testDocumentId = 'testId';
const testEncryptedDocument = {
  cipherText: 'testCipherText',
  iv: 'testIv',
  tag: 'testTag',
  type: 'testType',
};

describe('S3Adapter', () => {
  const s3StorageClient = new S3Adapter(mockAwsProviderConfig);

  test('it should return a document if it exists', async () => {
    mockS3Promise.mockResolvedValueOnce({
      Body: JSON.stringify(testEncryptedDocument),
    });

    const encryptedDocument = await s3StorageClient.getDocument(testDocumentId);

    expect(encryptedDocument).toStrictEqual(testEncryptedDocument);
  });

  test('it should return null if body is empty', async () => {
    mockS3Promise.mockResolvedValueOnce('documentMissingBody');

    expect(await s3StorageClient.getDocument(testDocumentId)).toBe(null);
  });

  test('it should return null if document does not exists', async () => {
    mockS3Promise.mockRejectedValueOnce(
      new Error('The specified key does not exist.')
    );

    expect(await s3StorageClient.getDocument(testDocumentId)).toBe(null);
  });

  test('it should return an error if unexpected error is thrown', async () => {
    mockS3Promise.mockRejectedValue(new Error());

    await expect(s3StorageClient.getDocument(testDocumentId)).rejects.toThrow();
  });
});
