import { RunError } from '@pulumi/pulumi';

if (
  !(
    process.env.TARGET_DOMAIN &&
    process.env.DVP_API_DOMAIN &&
    process.env.REVOCATION_LIST_BIT_STRING_LENGTH
  )
) {
  throw new RunError(
    `Missing one or more of the required environment variables: TARGET_DOMAIN, DVP_API_DOMAIN, REVOCATION_LIST_BIT_STRING_LENGTH`
  );
}

export const config = {
  targetDomain: process.env.TARGET_DOMAIN,
  dvpApiDomain: process.env.DVP_API_DOMAIN,
  apiUrl: `https://${process.env.DVP_API_DOMAIN}/api`,
  clientUrl: `https://${process.env.DVP_DOMAIN}`,
  // Defaults to 16KB (131,072 entries)
  revocationListBitStringLength:
    process.env.REVOCATION_LIST_BIT_STRING_LENGTH ?? 131072,
};
