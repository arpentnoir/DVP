import * as pulumi from '@pulumi/pulumi';
import { auditLogBucket } from '../common/auditLogBucket';
import { originAccessIdentity } from '../common/originAccessIdentity';
import { createS3HostedWebsite } from './s3Website';

const config = {
  hostedZoneDomain: process.env.TARGET_DOMAIN,
  dvpDomain: process.env.DVP_DOMAIN,
  dvpInternalDomain: process.env.DVP_INTERNAL_DOMAIN,
};
if (
  !(config.hostedZoneDomain && config.dvpDomain && config.dvpInternalDomain)
) {
  throw new pulumi.RunError(
    `Missing one or more of the required environment variables: TARGET_DOMAIN, DVP_DOMAIN, DVP_INTERNAL_DOMAIN`
  );
}

// DVP Internet Client App
export const {
  websiteBucketName: dvpWebsiteBucketName,
  websiteCloudfrontAliases: dvpWebsiteCloudfrontAliases,
} = createS3HostedWebsite({
  bucketName: 'dvpWebsite',
  domain: config.dvpDomain,
  hostedZoneDomain: config.hostedZoneDomain,
  pathToBucketContents: '../../artifacts/client-build-internet',
  auditLogBucket: auditLogBucket,
  originAccessIdentity: originAccessIdentity,
});

// DVP Internal Client App
export const {
  websiteBucketName: dvpInternalWebsiteBucketName,
  websiteCloudfrontAliases: dvpInternalWebsiteCloudfrontAliases,
} = createS3HostedWebsite({
  bucketName: 'dvpInternalWebsite',
  domain: config.dvpInternalDomain,
  hostedZoneDomain: config.hostedZoneDomain,
  pathToBucketContents: '../../artifacts/client-build-internal',
  auditLogBucket: auditLogBucket,
  originAccessIdentity: originAccessIdentity,
});
