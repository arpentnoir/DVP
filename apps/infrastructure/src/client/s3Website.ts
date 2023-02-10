/* eslint-disable no-console */
import { OriginAccessIdentity } from '@pulumi/aws/cloudfront';
import { ComponentResourceOptions } from '@pulumi/pulumi';
import fs from 'fs-extra';
import { Components } from 'gs-pulumi-library';
import path from 'path';
import * as aws from '@pulumi/aws';

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
  disableSignup: boolean;
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
    DISABLE_SIGNUP: config.disableSignup,

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

  const provider = new aws.Provider(`${config.bucketName}-provider-us-east-1`, {
    region: 'us-east-1',
  });

  const wafipSet = new aws.waf.IpSet(`${config.bucketName}-ipset`, {ipSetDescriptors: [
    {type: "IPV4", value: "164.97.246.192/28"},
    {type: "IPV4", value: "20.36.64.0/19"},
    {type: "IPV4", value: "20.36.112.0/20"},
    {type: "IPV4", value: "20.39.72.0/21"},
    {type: "IPV4", value: "20.39.96.0/19"},
    {type: "IPV4", value: "40.82.12.0/22"},
    {type: "IPV4", value: "40.82.244.0/22"},
    {type: "IPV4", value: "40.90.130.32/28"},
    {type: "IPV4", value: "40.90.142.64/27"},
    {type: "IPV4", value: "40.90.149.32/27"},
    {type: "IPV4", value: "40.126.128.0/18"},
    {type: "IPV4", value: "52.143.218.0/24"},
    {type: "IPV4", value: "52.239.218.0/23"},
    {type: "IPV4", value: "20.36.32.0/19"},
    {type: "IPV4", value: "20.36.104.0/21"},
    {type: "IPV4", value: "20.37.0.0/16"},
    {type: "IPV4", value: "20.38.184.0/22"},
    {type: "IPV4", value: "20.39.64.0/21"},
    {type: "IPV4", value: "40.82.8.0/22"},
    {type: "IPV4", value: "40.82.240.0/22"},
    {type: "IPV4", value: "40.90.130.48/28"},
    {type: "IPV4", value: "40.90.142.96/27"},
    {type: "IPV4", value: "40.90.149.64/27"},
    {type: "IPV4", value: "52.143.219.0/24"},
    {type: "IPV4", value: "52.239.216.0/23"},
    {type: "IPV4", value: "101.167.226.80/28"},
    {type: "IPV4", value: "101.167.229.80/28"},
    {type: "IPV4", value: "164.97.245.84/32"},
    {type: "IPV4", value: "162.145.253.0/24"},
    {type: "IPV4", value: "20.37.10.126/32"},
    {type: "IPV4", value: "52.63.239.67/32"},
    {type: "IPV4", value: "13.237.226.46/32"}
  ]}, { provider: provider });

  const wafRule = new aws.waf.Rule(`${config.bucketName}-rule`, {
    metricName: "RuleMetric",
    predicates: [{
      dataId: wafipSet.id,
      negated: false,
      type: "IPMatch",
    }],
    }, {
      dependsOn: [wafipSet],
  });

  const wafAcl = new aws.waf.WebAcl(`${config.bucketName}-wafAcl`, {
    metricName: "webACLMetric",
    defaultAction: {
      type: "BLOCK",
    },
    rules: [{
      action: {
        type: "ALLOW",
      },
      priority: 1,
      ruleId: wafRule.id,
      type: "REGULAR",
    }], 
    }, {
    dependsOn: [
      wafipSet,
      wafRule,
    ],
  });

  const website = new Components.aws.CloudfrontWebsite(config.bucketName, {
    description: `Static website for ${config.bucketName} SPA. Stored on S3. Served via Cloudfront`,

    s3Bucket: websiteS3Bucket.bucket,

    hostedZoneDomain: config.hostedZoneDomain,
    targetDomain: config.domain,
    logBucket: config.auditLogBucket.bucket,
    logBucketPrefix: `cloudfront/${config.domain}/`,
    originAccessIdentity: config.originAccessIdentity,
    webAclId: wafAcl.id
  });

  return {
    websiteBucketName: websiteS3Bucket.bucketName(),
    websiteCloudfrontAliases: website.cloudfrontAliases(),
  };
};
