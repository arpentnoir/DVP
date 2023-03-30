/* eslint-disable @typescript-eslint/no-explicit-any */
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import { auth, kms } from '../common';
import { getGatewayOpenApiSpec } from '../common/apigateway';
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
          Resource: [
            dynamodbDocumentsTable.arn,
            pulumi.interpolate`${dynamodbDocumentsTable.arn}/index/*`,
          ],
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
  timeout: 60,
});

////////////////////////////////////////////////////////////////////////////////
// ApiGateway for api

const apiGateway = pulumi
  .all([
    lambdaApiHandler.arn,
    auth.dvpInternetUserPool.arn,
    auth.dvpInternalUserPool.arn,
  ])
  .apply(
    ([lambdaApiHandlerArn, dvpInternetUserPoolArn, dvpInternalUserPoolArn]) => {
      const apiName = `${stack}-admin-api`;
      const openAPISpec = getGatewayOpenApiSpec({
        apiDomain: config.dvpAdminApiDomain,
        apiInternalPath: config.apiInternalPath,
        cognitoUserPoolArns: [dvpInternetUserPoolArn, dvpInternalUserPoolArn],
        lambdaApiHandlerArn: lambdaApiHandlerArn,
        name: apiName,
        openapiSpecPath: `${apiDir}/openapi/openapi.json`,
      });

      return new awsx.apigateway.API(apiName, {
        swaggerString: JSON.stringify(openAPISpec),
        stageName: config.apiInternalPath.replace(/\//g, ''),
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
    }
  );

new aws.lambda.Permission(`${stack}-admin-api-handler-permission`, {
  action: 'lambda:InvokeFunction',
  function: lambdaApiHandler.name,
  principal: 'apigateway.amazonaws.com',
  sourceArn: pulumi.interpolate`${apiGateway.restAPI.executionArn}/*/*/*`,
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

new aws.apigateway.MethodSettings(`${stack}-admin-api-method-settings`, {
  restApi: apiGateway.restAPI.id,
  stageName: apiGateway.stage.stageName,
  methodPath: '*/*',
  settings: {
    metricsEnabled: true,
    loggingLevel: 'INFO',
  },
});

////////////////////////////////////////////////////////////////////////////////
// Custom domain name for admin api

const providerAdmin = new aws.Provider(`${stack}-provider-admin-us-east-1`, {
  region: 'us-east-1',
});

// Get hosted zone
const hostedZoneAdminId = aws.route53
  .getZone({ name: config.targetDomain }, {})
  .then((zone) => zone.zoneId);

// Create new certificate
const sslNewCertificateAdmin = new aws.acm.Certificate(
  config.dvpAdminApiDomain,
  {
    domainName: config.dvpAdminApiDomain,
    validationMethod: 'DNS',
  }
);

const sslNewCertificateUSEastAdmin = new aws.acm.Certificate(
  `${config.dvpAdminApiDomain}-us-east`,
  {
    domainName: config.dvpAdminApiDomain,
    validationMethod: 'DNS',
  },
  { provider: providerAdmin }
);

// Add to route53 DNS.  Required for validation
const sslCertificateValidation = new aws.route53.Record(
  `${config.dvpAdminApiDomain}-validation`,
  {
    name: sslNewCertificateAdmin.domainValidationOptions[0].resourceRecordName,
    records: [
      sslNewCertificateAdmin.domainValidationOptions[0].resourceRecordValue,
    ],
    ttl: 60,
    type: sslNewCertificateAdmin.domainValidationOptions[0].resourceRecordType,
    zoneId: hostedZoneAdminId,
  }
);

// Register custom domain name with ApiGateway
const apiDomainName = new aws.apigatewayv2.DomainName(
  `${stack}-admin-api-domain-name`,
  {
    domainNameConfiguration: {
      certificateArn: sslNewCertificateAdmin.arn,
      endpointType: 'REGIONAL',
      securityPolicy: 'TLS_1_2',
    },
    domainName: config.dvpAdminApiDomain,
  },
  { dependsOn: [sslCertificateValidation] }
);

// Create dns record
new aws.route53.Record(`${stack}-admin-api-dns`, {
  zoneId: hostedZoneAdminId,
  type: 'A',
  name: config.dvpAdminApiDomain,
  aliases: [
    {
      name: apiDomainName.domainNameConfiguration.apply(
        (domainNameConfiguration) => domainNameConfiguration.targetDomainName
      ),
      zoneId: apiDomainName.domainNameConfiguration.apply(
        (domainNameConfiguration) => domainNameConfiguration.hostedZoneId
      ),
      evaluateTargetHealth: false,
    },
  ],
});

// Map stage name to custom domain
new aws.apigateway.BasePathMapping(`${stack}-admin-api-domain-mapping`, {
  restApi: apiGateway.restAPI.id,
  domainName: apiDomainName.domainName,
});

export const apigatewayUrl = `https://${config.dvpAdminApiDomain}`;
