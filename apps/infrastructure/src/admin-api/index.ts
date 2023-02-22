/* eslint-disable @typescript-eslint/no-explicit-any */
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import { auth, kms } from '../common';
import { dynamodbDocumentsTable } from '../common/dynamodb';

import * as vpc from '../common/vpc';
import { config } from './config';
import { lambdaRole } from './roles/lambdaRole';

const stack = pulumi.getStack();

const apiDir = '../../artifacts/admin-api-build'; // directory for content files

////////////////////////////////////////////////////////////////////////////////
// Log group for api
const apiLogGroup = new aws.cloudwatch.LogGroup(`${stack}-admin-api-log-group`);

////////////////////////////////////////////////////////////////////////////////
// Enviroment variables for Lambda functions

const environmentVariables = {
  variables: {
    API_URL: config.apiUrl,
    DYNAMODB_DOCUMENTS_TABLE: dynamodbDocumentsTable.name,
  },
};

////////////////////////////////////////////////////////////////////////////////
// Lambda role policy attachments
new aws.iam.RolePolicyAttachment(
  `${stack}-admin-api-handler-lambda-execute-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaExecute,
  }
);

new aws.iam.RolePolicyAttachment(
  `${stack}-admin-api-handler-lambda-xray-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSXrayWriteOnlyAccess,
  }
);

const dynamodbLambdaPolicy = new aws.iam.Policy(
  `${stack}-admin-api-handler-dynamodb-lambda-policy`,
  {
    policy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:BatchGetItem',
            'dynamodb:GetItem',
            'dynamodb:Query',
            'dynamodb:BatchWriteItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem',
          ],
          Resource: dynamodbDocumentsTable.arn,
        },
      ],
    },
  }
);

new aws.iam.RolePolicyAttachment(`${stack}-admin-api-handler-lambda-dynamodb`, {
  role: lambdaRole.name,
  policyArn: dynamodbLambdaPolicy.arn,
});

new aws.iam.RolePolicyAttachment(
  `${stack}-admin-api-handler-lambda-vpc-execution-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaVPCAccessExecutionRole,
  }
);

const kmsLambdaPolicy = new aws.iam.Policy(
  `${stack}-admin-api-kms-lambda-policy`,
  {
    policy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['kms:Encrypt', 'kms:Decrypt', 'kms:GenerateDataKey*'],
          Resource: kms.kmsCmkAlias.targetKeyArn,
        },
      ],
    },
  }
);

new aws.iam.RolePolicyAttachment(`${stack}-admin-api-kms-policy-attachment`, {
  role: lambdaRole.name,
  policyArn: kmsLambdaPolicy.arn,
});
////////////////////////////////////////////////////////////////////////////////
// Lambda functions for apis
const lambdaApiHandler = new aws.lambda.Function(`${stack}-admin-api-handler`, {
  memorySize: 512,
  role: lambdaRole.arn,
  code: new pulumi.asset.FileArchive(apiDir),
  handler: 'index.handler',
  runtime: 'nodejs16.x',
  environment: { ...environmentVariables },
  tracingConfig: {
    mode: 'Active',
  },
  vpcConfig: {
    subnetIds: vpc.dvpVpcPrivateSubnetIds,
    securityGroupIds: [vpc.dvpVpcDefaultSecurityGroupId],
  },
  timeout: 15,
});

////////////////////////////////////////////////////////////////////////////////
// ApiGateway for api

const authorizer = awsx.apigateway.getCognitoAuthorizer({
  authorizerName: `${stack}-admin-api-cognito-authorizer`,
  providerARNs: [auth.dvpInternetUserPool, auth.dvpInternalUserPool],
  authorizerResultTtlInSeconds: 0,
});
const routes: awsx.apigateway.Route[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
].map((method) => ({
  path: '/{proxy+}',
  method: method as awsx.apigateway.Method,
  eventHandler: lambdaApiHandler,
  authorizers: method !== 'OPTIONS' ? [authorizer] : [],
}));

const apiGateway = new awsx.apigateway.API(`${stack}-admin-api`, {
  routes,
  stageName: `${stack}-admin-api`,
  restApiArgs: {
    endpointConfiguration: {
      types: 'EDGE',
    },
  },
  stageArgs: {
    xrayTracingEnabled: true,
    accessLogSettings: {
      destinationArn: apiLogGroup.arn,
      format: JSON.stringify({
        requestId: '$context.requestId',
        ip: '$context.identity.sourceIp',
        caller: '$context.identity.caller',
        user: '$context.identity.user',
        requestTime: '$context.requestTime',
        httpMethod: '$context.httpMethod',
        resourcePath: '$context.resourcePath',
        status: '$context.status',
        protocol: '$context.protocol',
      }),
    },
  },
});

new aws.apigateway.RestApiPolicy(`${stack}-admin-api-authorizers-policy`, {
  restApiId: apiGateway.restAPI.id,
  policy: pulumi.interpolate`{
    "Effect": "Allow",
    "Action": ["apigateway:*"],
    "Resource": "${apiGateway.restAPI.executionArn}/authorizers",
    "Condition": {
      "ArnLike": {
        "apigateway:CognitoUserPoolProviderArn": ["${auth.dvpInternalUserPool.arn}","${auth.dvpInternetUserPool.arn}"]
      }
    }
  }`,
});

new aws.apigateway.MethodSettings('all', {
  restApi: apiGateway.restAPI.id,
  stageName: apiGateway.stage.stageName,
  methodPath: '*/*',
  settings: {
    metricsEnabled: true,
    loggingLevel: 'INFO',
  },
});

////////////////////////////////////////////////////////////////////////////////
// Custom domain name for api

const provider = new aws.Provider(`${stack}-provider-us-east-1`, {
  region: 'us-east-1',
});

// Get ssl certificate
const sslCertificate = pulumi.output(
  aws.acm.getCertificate(
    {
      domain: config.dvpAdminApiDomain,
      statuses: ['ISSUED'],
    },
    { provider: provider }
  )
);

// Get hosted zone
const hostedZoneId = aws.route53
  .getZone({ name: config.targetDomain }, {})
  .then((zone) => zone.zoneId);

// Register custom domain name with ApiGateway
const apiDomainName = new aws.apigateway.DomainName(
  `${stack}-admin-api-domain-name`,
  {
    certificateArn: sslCertificate.arn,
    domainName: config.dvpAdminApiDomain,
  }
);

// Create dns record
new aws.route53.Record(`${stack}-admin-api-dns`, {
  zoneId: hostedZoneId,
  type: 'A',
  name: config.dvpAdminApiDomain,
  aliases: [
    {
      name: apiDomainName.cloudfrontDomainName,
      evaluateTargetHealth: true,
      zoneId: apiDomainName.cloudfrontZoneId,
    },
  ],
});

// Map stage name to custom domain
new aws.apigateway.BasePathMapping(`${stack}-admin-api-domain-mapping`, {
  restApi: apiGateway.restAPI.id,
  stageName: apiGateway.stage.stageName,
  domainName: apiDomainName.domainName,
});

export const apigatewayUrl = `https://${config.dvpAdminApiDomain}`;
