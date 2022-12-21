import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

const stack = pulumi.getStack();

export interface CognitoAuthArgs {
  website: string;
  googleClientId: string;
  googleClientSecret: string;
  region: string;
}

export class CognitoAuth extends pulumi.ComponentResource {
  readonly userPool: aws.cognito.UserPool;
  readonly userPoolDomain: aws.cognito.UserPoolDomain;
  readonly userClient: aws.cognito.UserPoolClient;
  readonly googleProvider: aws.cognito.IdentityProvider;

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
    });

    this.userPoolDomain = new aws.cognito.UserPoolDomain(
      `${name}-user-pool-domain`,
      {
        domain: `${name}-user-pool-domain`,
        userPoolId: this.userPool.id,
      }
    );

    this.userClient = new aws.cognito.UserPoolClient(
      `${name}-user-pool-client`,
      {
        userPoolId: this.userPool.id.apply((val) => val),
        generateSecret: false,
        explicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
        supportedIdentityProviders: ['Google', 'COGNITO'],
        allowedOauthFlows: ['implicit'],
        callbackUrls: ['http://localhost:3000', `https://${args.website}`],
        allowedOauthScopes: ['email', 'openid'],
        allowedOauthFlowsUserPoolClient: true,
      }
    );

    // Google OAUTH Setup
    this.googleProvider = new aws.cognito.IdentityProvider(
      `${name}-google-oauth`,
      {
        userPoolId: this.userPool.id.apply((val) => val),
        providerName: 'Google',
        providerType: 'Google',
        providerDetails: {
          authorize_scopes: 'email',
          client_id: args.googleClientId,
          client_secret: args.googleClientSecret,
        },
        attributeMapping: {
          email: 'email',
          username: 'sub',
        },
      }
    );
  }
}

export const setupCognitoAuth = (name: string, config: CognitoAuthArgs) => {
  const cognitoAuth = new CognitoAuth(`${stack}-${name}`, {
    googleClientId: config.googleClientId,
    googleClientSecret: config.googleClientSecret,
    region: config.region,
    website: config.website,
  });

  // User Pool
  const usePoolDomain = cognitoAuth.userPoolDomain.domain.apply(
    (val) =>
      `https://${val}.auth.${config.region}.amazoncognito.com/oauth2/authorize`
  );
  const jwksUri = cognitoAuth.userPool.id.apply(
    (id) =>
      `https://cognito-idp.${config.region}.amazonaws.com/${id}/.well-known/jwks.json`
  );
  const issuer = cognitoAuth.userPool.id.apply(
    (id) => `https://cognito-idp.${config.region}.amazonaws.com/${id}`
  );
  const userPoolClientId = cognitoAuth.userClient.id.apply((val) => val);
  const audience = cognitoAuth.userClient.id.apply((val) => val);
  return {
    userPoolDomain: usePoolDomain,
    jwksUri,
    issuer,
    userPoolClientId,
    audience,
  };
};
