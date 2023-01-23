import { RunError } from '@pulumi/pulumi';

if (!(process.env.TARGET_DOMAIN && process.env.DVP_API_DOMAIN)) {
  throw new RunError(
    `Missing one or more of the required environment variables: TARGET_DOMAIN, DVP_API_DOMAIN"}`
  );
}

export const config = {
  targetDomain: process.env.TARGET_DOMAIN,
  dvpApiDomain: process.env.DVP_API_DOMAIN,
  apiUrl: `https://${process.env.DVP_API_DOMAIN}/api`,
  clientUrl: `https://${process.env.DVP_DOMAIN}`,
};
