import { setupCognitoAuth } from './cognito';

export const {
  audience: dvpInternalAudience,
  issuer: dvpInternalIssuer,
  jwksUri: dvpInternalJwksUri,
  userPoolClientId: dvpInternalUserPoolClientId,
  userPoolDomain: dvpInternalUserPoolDomain,
} = setupCognitoAuth('auth-internal', {
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  region: process.env.AWS_REGION,
  website: process.env.DVP_INTERNAL_DOMAIN,
});

export const {
  audience: dvpExternalAudience,
  issuer: dvpExternalIssuer,
  jwksUri: dvpExternalJwksUri,
  userPoolClientId: dvpExternalUserPoolClientId,
  userPoolDomain: dvpExternalUserPoolDomain,
} = setupCognitoAuth('auth-external', {
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  region: process.env.AWS_REGION,
  website: process.env.DVP_DOMAIN,
});
