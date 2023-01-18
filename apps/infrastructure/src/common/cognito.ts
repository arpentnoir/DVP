import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

const stack = pulumi.getStack();

export interface CognitoAuthArgs {
  website: string;
  region: string;
  allowAdminCreateUserOnly: boolean;
}

export class CognitoAuth extends pulumi.ComponentResource {
  readonly userPool: aws.cognito.UserPool;
  readonly userPoolDomain: aws.cognito.UserPoolDomain;
  readonly userPoolClient: aws.cognito.UserPoolClient;

  /**
   * Creates a new user pool, domain amd identity provider.
   * @param name  The _unique_ name of the resource.
   * @param args  The arguments to configure cognito.
   * @param opts  A bag of options that control this resource's behavior.
   */

  constructor(
    name: string,
    args: CognitoAuthArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super('aws-cognito', name, {}, opts);

    this.userPool = new aws.cognito.UserPool(`${name}-user-pool`, {
      autoVerifiedAttributes: ['email'],
      adminCreateUserConfig: {
        allowAdminCreateUserOnly: args.allowAdminCreateUserOnly,
      },
    });

    this.userPoolDomain = new aws.cognito.UserPoolDomain(
      `${name}-user-pool-domain`,
      {
        domain: `${name}-user-pool-domain`,
        userPoolId: this.userPool.id,
      }
    );

    this.userPoolClient = new aws.cognito.UserPoolClient(
      `${name}-user-pool-client`,
      {
        userPoolId: this.userPool.id.apply((val) => val),
        generateSecret: false,
        explicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
        supportedIdentityProviders: ['COGNITO'],
        allowedOauthFlows: ['code'],
        logoutUrls: [
          'http://localhost:4200',
          'http://localhost:3000',
          `https://${args.website}`,
        ],
        callbackUrls: [
          'http://localhost:3000',
          'http://localhost:4200',
          `https://${args.website}`,
        ],
        allowedOauthScopes: ['email', 'openid', 'phone', 'profile'],
        allowedOauthFlowsUserPoolClient: true,
      }
    );
  }
}

export const setupCognitoAuth = (name: string, config: CognitoAuthArgs) => {
  const cognitoAuth = new CognitoAuth(`${stack}-${name}`, {
    region: config.region,
    website: config.website,
    allowAdminCreateUserOnly: config.allowAdminCreateUserOnly,
  });

  // User Pool

  const userPoolDomainUrl = pulumi.interpolate`${cognitoAuth.userPoolDomain.domain}.auth.${config.region}.amazoncognito.com`;
  const userPoolId = pulumi.interpolate`${cognitoAuth.userPool.id}`;
  const userPoolClientId = pulumi.interpolate`${cognitoAuth.userPoolClient.id}`;
  const jwksUri = pulumi.interpolate`https://cognito-idp.${config.region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  const issuer = pulumi.interpolate`https://cognito-idp.${config.region}.amazonaws.com/${userPoolId}`;

  return {
    userPool: cognitoAuth.userPool,
    userPoolDomain: cognitoAuth.userPoolDomain,
    userPoolClient: cognitoAuth.userPoolClient,
    userPoolId,
    userPoolClientId,
    userPoolDomainUrl,
    jwksUri,
    issuer,
  };
};
