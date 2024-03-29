import { RunError } from '@pulumi/pulumi';

if (
  !(
    process.env.TARGET_DOMAIN &&
    process.env.DVP_ADMIN_API_INTERNAL_PATH &&
    process.env.DVP_ADMIN_API_DOMAIN
  )
) {
  throw new RunError(
    `Missing one or more of the required environment variables: TARGET_DOMAIN, DVP_ADMIN_API_INTERNAL_PATH, DVP_ADMIN_API_DOMAIN"}`
  );
}

export const config = {
  targetDomain: process.env.TARGET_DOMAIN,
  dvpAdminApiDomain: process.env.DVP_ADMIN_API_DOMAIN,
  apiUrl: `https://${process.env.DVP_ADMIN_API_DOMAIN}${process.env.DVP_ADMIN_API_INTERNAL_PATH}`,
  apiInternalPath: process.env.DVP_ADMIN_API_INTERNAL_PATH,
};
