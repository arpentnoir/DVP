import { S3Event } from './s3-event';

describe('S3Event', () => {
  it('should construct s3 event object', () => {
    const event = new S3Event('bucket', 'key', true);
    expect(event.bucketName).toBe('bucket');
    expect(event.objectKey).toBe('key');
    expect(event.deleted).toBe(true);
  });
});
