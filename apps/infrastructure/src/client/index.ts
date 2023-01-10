import * as pulumi from '@pulumi/pulumi';
import { auth } from '../common';
import { auditLogBucket } from '../common/auditLogBucket';
import { originAccessIdentity } from '../common/originAccessIdentity';
import { createS3HostedWebsite, injectConfigFile } from './s3Website';

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

// inject configs

pulumi
  .all([
    auth.dvpInternetUserPoolId,
    auth.dvpInternetUserPoolClientId,
    auth.dvpInternetUserPoolDomainUrl,
  ])
  .apply(
    ([
      dvpInternetUserPoolId,
      dvpInternetUserPoolClientId,
      dvpInternetUserPoolDomainUrl,
    ]) => {
      injectConfigFile('../../artifacts/client-build-internet', {
        siteUrl: `https://${config.dvpDomain}`,
        apiUrl: `https://${process.env.DVP_API_DOMAIN}/api`,
        authUserPool: dvpInternetUserPoolId,
        authClient: dvpInternetUserPoolClientId,
        authDomain: dvpInternetUserPoolDomainUrl,
        authOauthScope: 'email openid',
        authRegion: process.env.AWS_REGION,
        vcContextEndpoint: process.env.VC_CONTEXT_ENDPOINT,
        vcRendererEndpoint: process.env.VC_RENDERER_ENDPOINT,
        disableSignup: false,
      });

      // DVP Internet Client App
      createS3HostedWebsite(
        {
          bucketName: 'dvpWebsite',
          domain: config.dvpDomain,
          hostedZoneDomain: config.hostedZoneDomain,
          pathToBucketContents: '../../artifacts/client-build-internet',
          auditLogBucket: auditLogBucket,
          originAccessIdentity: originAccessIdentity,
        },
        {
          dependsOn: [
            auth.dvpInternetUserPool,
            auth.dvpInternetUserPoolClient,
            auth.dvpInternetUserPoolDomain,
          ],
        }
      );
    }
  );

pulumi
  .all([
    auth.dvpInternalUserPoolId,
    auth.dvpInternalUserPoolClientId,
    auth.dvpInternalUserPoolDomainUrl,
  ])
  .apply(
    ([
      dvpInternalUserPoolId,
      dvpInternalUserPoolClientId,
      dvpInternalUserPoolDomainUrl,
    ]) => {
      injectConfigFile('../../artifacts/client-build-internal', {
        siteUrl: `https://${config.dvpInternalDomain}`,
        apiUrl: `https://${process.env.DVP_API_DOMAIN}/api`,
        authClient: dvpInternalUserPoolClientId,
        authDomain: dvpInternalUserPoolDomainUrl,
        authUserPool: dvpInternalUserPoolId,
        authOauthScope: 'email openid',
        authRegion: process.env.AWS_REGION,
        vcContextEndpoint: process.env.VC_CONTEXT_ENDPOINT,
        vcRendererEndpoint: process.env.VC_RENDERER_ENDPOINT,
        disableSignup: true,
      });

      // DVP Internal Client App
      createS3HostedWebsite(
        {
          bucketName: 'dvpInternalWebsite',
          domain: config.dvpInternalDomain,
          hostedZoneDomain: config.hostedZoneDomain,
          pathToBucketContents: '../../artifacts/client-build-internal',
          auditLogBucket: auditLogBucket,
          originAccessIdentity: originAccessIdentity,
        },
        {
          dependsOn: [
            auth.dvpInternalUserPool,
            auth.dvpInternalUserPoolClient,
            auth.dvpInternalUserPoolDomain,
          ],
        }
      );
    }
  );
