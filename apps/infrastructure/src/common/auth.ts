import { setupCognitoAuth } from './cognito';

export const {
  userPool: dvpInternalUserPool,
  userPoolClient: dvpInternalUserPoolClient,
  userPoolDomain: dvpInternalUserPoolDomain,
  issuer: dvpInternalIssuer,
  jwksUri: dvpInternalJwksUri,
  userPoolClientId: dvpInternalUserPoolClientId,
  userPoolDomainUrl: dvpInternalUserPoolDomainUrl,
  userPoolId: dvpInternalUserPoolId,
} = setupCognitoAuth('auth-internal', {
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  region: process.env.AWS_REGION,
  website: process.env.DVP_INTERNAL_DOMAIN,
});

export const {
  userPool: dvpInternetUserPool,
  userPoolClient: dvpInternetUserPoolClient,
  userPoolDomain: dvpInternetUserPoolDomain,
  issuer: dvpInternetIssuer,
  jwksUri: dvpInternetJwksUri,
  userPoolClientId: dvpInternetUserPoolClientId,
  userPoolDomainUrl: dvpInternetUserPoolDomainUrl,
  userPoolId: dvpInternetUserPoolId,
} = setupCognitoAuth('auth-internet', {
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  region: process.env.AWS_REGION,
  website: process.env.DVP_DOMAIN,
});
