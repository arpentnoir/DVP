export class S3Event {
  public bucketName: string;
  public objectKey: string;
  public deleted: boolean;

  public constructor(bucketName: string, objectKey: string, deleted: boolean) {
    this.bucketName = bucketName;
    this.objectKey = objectKey;
    this.deleted = deleted;
  }
}
