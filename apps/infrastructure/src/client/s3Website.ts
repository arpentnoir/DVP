import { Components } from 'gs-pulumi-library';
import { OriginAccessIdentity } from '@pulumi/aws/cloudfront';

export interface S3HostedWebsiteConfig {
  bucketName: string;
  domain: string;
  hostedZoneDomain: string;
  pathToBucketContents: string;
  auditLogBucket: Components.aws.S3Bucket;
  originAccessIdentity: OriginAccessIdentity;
}

export const createS3HostedWebsite = (config: S3HostedWebsiteConfig) => {
  //
  // Create S3 Bucket and Cloudfront Distribution for `dvpWebsite`
  const websiteS3Bucket = new Components.aws.S3Bucket(
    `${config.bucketName}S3Bucket`,
    {
      description: `S3 Bucket for '${config.bucketName}' static website contents.`,
      bucketName: config.domain,
      /**
       * NOTE on argument `kmsMasterKeyId` -
       * Cloudfront cannot by default access S3 objects encrypted with SSE-KMS. To do so requires setting up Cloudfront Lambda@Edge.
       * See: https://aws.amazon.com/blogs/networking-and-content-delivery/serving-sse-kms-encrypted-content-from-s3-using-cloudfront/
       * Therefore - for the moment we omit the `kmsMasterKeyId` and thus default to using standard SSE-S3 encryption on this bucket.
       * TODO - clarify requirements with client.
       */
      // kmsMasterKeyId: kmsCmkAlias.targetKeyId,
      logBucket: config.auditLogBucket.bucket,
      logBucketPrefix: `s3/${config.domain}/`,
      pathToBucketContents: config.pathToBucketContents,
      website: { indexDocument: 'index.html', errorDocument: 'index.html' },
      forceDestroy: true,
    }
  );

  const website = new Components.aws.CloudfrontWebsite(config.bucketName, {
    description: `Static website for ${config.bucketName} SPA. Stored on S3. Served via Cloudfront`,

    s3Bucket: websiteS3Bucket.bucket,

    hostedZoneDomain: config.hostedZoneDomain,
    targetDomain: config.domain,
    logBucket: config.auditLogBucket.bucket,
    logBucketPrefix: `cloudfront/${config.domain}/`,
    originAccessIdentity: config.originAccessIdentity,
  });

  return {
    websiteBucketName: websiteS3Bucket.bucketName(),
    websiteCloudfrontAliases: website.cloudfrontAliases(),
  };
};
