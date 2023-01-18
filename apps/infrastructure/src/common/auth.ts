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
  region: process.env.AWS_REGION,
  website: process.env.DVP_INTERNAL_DOMAIN,
  allowAdminCreateUserOnly: true,
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
  region: process.env.AWS_REGION,
  website: process.env.DVP_DOMAIN,
  allowAdminCreateUserOnly: false,
});
