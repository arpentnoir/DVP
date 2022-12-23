/* eslint-disable no-console */
import { OriginAccessIdentity } from '@pulumi/aws/cloudfront';
import { ComponentResourceOptions } from '@pulumi/pulumi';
import fs from 'fs-extra';
import { Components } from 'gs-pulumi-library';
import path from 'path';

export interface S3HostedWebsiteConfig {
  bucketName: string;
  domain: string;
  hostedZoneDomain: string;
  pathToBucketContents: string;
  auditLogBucket: Components.aws.S3Bucket;
  originAccessIdentity: OriginAccessIdentity;
}

export interface AppConfig {
  siteUrl: string;
  apiUrl: string;

  vcContextEndpoint: string;
  vcRendererEndpoint: string;

  // pulumi outputs
  authRegion: string;
  authDomain: string;
  authClient: string;
  authUserPool: string;
  authOauthScope: string;
}

export const injectConfigFile = (pathToArtifact: string, config: AppConfig) => {
  const configFilePath = path.resolve(
    __dirname,
    `../../${pathToArtifact}/env/env-config.js`
  );

  fs.ensureFileSync(configFilePath);
  console.log(`Injecting config file into ${configFilePath}...`);

  const envConfig = {
    SITE_URL: config.siteUrl,
    API_URL: config.apiUrl,

    // auth settings
    AUTH_DOMAIN: config.authDomain,
    AUTH_REGION: config.authRegion,
    AUTH_CLIENT: config.authClient,
    AUTH_USER_POOL: config.authUserPool,
    AUTH_OAUTH_SCOPE: config.authOauthScope,

    VC_CONTEXT_ENDPOINT: config.vcContextEndpoint,
    VC_RENDERER_ENDPOINT: config.vcRendererEndpoint,
  };

  const data = `window._env_ = ${JSON.stringify(envConfig)}`;
  fs.writeFileSync(configFilePath, data);
  console.log(`Injecting config file into ${pathToArtifact}...done`);
};

export const createS3HostedWebsite = (
  config: S3HostedWebsiteConfig,
  options?: ComponentResourceOptions
) => {
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
    },
    options
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
