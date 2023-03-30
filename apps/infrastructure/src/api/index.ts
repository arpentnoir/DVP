/* eslint-disable @typescript-eslint/no-explicit-any */
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import { Components } from 'gs-pulumi-library';
import { auth, kms } from '../common';
import { getGatewayOpenApiSpec } from '../common/apigateway';
import { dynamodbDocumentsTable } from '../common/dynamodb';
import * as vpc from '../common/vpc';
import { config } from './config';
import { bucketPolicy } from './policies/s3Policies';
import { cloudWatchRole } from './roles/cloudWatchRole';
import { lambdaRole } from './roles/lambdaRole';

const stack = pulumi.getStack();

const apiDir = '../../artifacts/api-build'; // directory for content files

////////////////////////////////////////////////////////////////////////////////
// Cloudwatch related role and policy
const cloudwatchRoleAndPolicy = cloudWatchRole;

////////////////////////////////////////////////////////////////////////////////
// Log group for api
const apiLogGroup = new aws.cloudwatch.LogGroup(`${stack}-api-log-group`);

////////////////////////////////////////////////////////////////////////////////
// S3 bucket for document store
const documentStoreBucket = new Components.aws.S3Bucket(
  `${stack}-document-store`,
  {
    description: 'S3 Bucket for `dvpWebsite` document store.',
    bucketName: `${stack}-document-store`,
    logBucket: 'none',
    forceDestroy: true,
  }
);

// Set the access policy for the document store bucket
new aws.s3.BucketPolicy(`${stack}-document-store-policy`, {
  bucket: documentStoreBucket.bucket.bucket,
  policy: pulumi
    .all([documentStoreBucket.bucket.bucket, lambdaRole.arn])
    .apply(([bucket, arn]) => bucketPolicy(bucket, arn)),
});

////////////////////////////////////////////////////////////////////////////////
// S3 bucket for revocation list
const revocationListBucket = new Components.aws.S3Bucket(
  `${stack}-revocation-list`,
  {
    description: 'S3 Bucket for `dvpWebsite` revocation list.',
    bucketName: `${stack}-revocation-list`,
    logBucket: 'none',
    forceDestroy: true,
  }
);

// Set the access policy for the revocation list
new aws.s3.BucketPolicy(`${stack}-revocation-list-policy`, {
  bucket: revocationListBucket.bucket.bucket,
  policy: pulumi
    .all([revocationListBucket.bucket.bucket, lambdaRole.arn])
    .apply(([bucket, arn]) => bucketPolicy(bucket, arn)),
});

////////////////////////////////////////////////////////////////////////////////
// Create Revocation Status Queue
export const revocationStatusQueue = new aws.sqs.Queue(
  `dvp-${process.env.ENV}-credential-status-event-queue`,
  {
    name: `dvp-${process.env.ENV}-credential-status-event-queue`,
  }
);

////////////////////////////////////////////////////////////////////////////////
// Enviroment variables for Lambda functions

export const environmentVariables = {
  variables: {
    DOCUMENT_STORAGE_BUCKET_NAME: documentStoreBucket.bucket.bucket,
    REVOCATION_LIST_BUCKET_NAME: revocationListBucket.bucket.bucket,
    REVOCATION_LIST_BIT_STRING_LENGTH: config.revocationListBitStringLength,
    API_URL: config.apiUrl,
    CLIENT_URL: config.clientUrl,
    DYNAMODB_DOCUMENTS_TABLE: dynamodbDocumentsTable.name,
    KMS_KEY_ID: kms.kmsCmk.id,
    REVOCATION_QUEUE_URL: revocationStatusQueue.url,
  },
};

////////////////////////////////////////////////////////////////////////////////
// Lambda role policy attachments
new aws.iam.RolePolicyAttachment(
  `${stack}-api-handler-lambda-execute-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaExecute,
  }
);

new aws.iam.RolePolicyAttachment(
  `${stack}-api-handler-lambda-xray-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSXrayWriteOnlyAccess,
  }
);

const dynamodbLambdaPolicy = new aws.iam.Policy(
  `${stack}-api-handler-dynamodb-lambda-policy`,
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

new aws.iam.RolePolicyAttachment(`${stack}-api-handler-lambda-dynamodb`, {
  role: lambdaRole.name,
  policyArn: dynamodbLambdaPolicy.arn,
});

const sqsLambdaPolicy = new aws.iam.Policy(
  `${stack}-api-handler-sqs-lambda-policy`,
  {
    policy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['sqs:SendMessage'],
          Resource: [revocationStatusQueue.arn],
        },
      ],
    },
  }
);

new aws.iam.RolePolicyAttachment(`${stack}-api-handler-lambda-sqs`, {
  role: lambdaRole.name,
  policyArn: sqsLambdaPolicy.arn,
});

new aws.iam.RolePolicyAttachment(
  `${stack}-api-handler-lambda-vpc-execution-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaVPCAccessExecutionRole,
  }
);

const kmsLambdaPolicy = new aws.iam.Policy(`${stack}-api-kms-lambda-policy`, {
  policy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['kms:Encrypt', 'kms:Decrypt'],
        Resource: kms.kmsCmkAlias.targetKeyArn,
      },
    ],
  },
});

new aws.iam.RolePolicyAttachment(`${stack}-api-kms-policy-attachment`, {
  role: lambdaRole.name,
  policyArn: kmsLambdaPolicy.arn,
});
////////////////////////////////////////////////////////////////////////////////
// Lambda functions for apis
const lambdaApiHandler = new aws.lambda.Function(`${stack}-api-handler`, {
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
      const apiName = `${stack}-api`;
      const openAPISpec = getGatewayOpenApiSpec({
        apiDomain: config.dvpApiDomain,
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

new aws.lambda.Permission(`${stack}-api-handler-permission`, {
  action: 'lambda:InvokeFunction',
  function: lambdaApiHandler.name,
  principal: 'apigateway.amazonaws.com',
  sourceArn: pulumi.interpolate`${apiGateway.restAPI.executionArn}/*/*/*`,
});

new aws.apigateway.RestApiPolicy(`${stack}-api-authorizers-policy`, {
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

// Get hosted zone
const hostedZoneId = aws.route53
  .getZone({ name: config.targetDomain }, {})
  .then((zone) => zone.zoneId);

// Create new certificate
const sslNewCertificate = new aws.acm.Certificate(config.dvpApiDomain, {
  domainName: config.dvpApiDomain,
  validationMethod: 'DNS',
});

const sslNewCertificateUSEast = new aws.acm.Certificate(
  `${config.dvpApiDomain}-us-east`,
  {
    domainName: config.dvpApiDomain,
    validationMethod: 'DNS',
  },
  { provider: provider }
);

// Add to route53 DNS.  Required for validation
const sslCertificateValidation = new aws.route53.Record(
  `${config.dvpApiDomain}-validation`,
  {
    name: sslNewCertificate.domainValidationOptions[0].resourceRecordName,
    records: [sslNewCertificate.domainValidationOptions[0].resourceRecordValue],
    ttl: 60,
    type: sslNewCertificate.domainValidationOptions[0].resourceRecordType,
    zoneId: hostedZoneId,
  }
);

// Get ssl certificate
const sslCertificate = pulumi.output(
  aws.acm.getCertificate(
    {
      domain: config.dvpApiDomain,
      statuses: ['ISSUED'],
    },
    { provider: provider }
  )
);

// Register custom domain name with ApiGateway
const apiDomainName = new aws.apigateway.DomainName(
  `${stack}-api-domain-name`,
  {
    certificateArn: sslCertificate.arn,
    domainName: config.dvpApiDomain,
  }
);

// Create dns record
new aws.route53.Record(`${stack}-api-dns`, {
  zoneId: hostedZoneId,
  type: 'A',
  name: config.dvpApiDomain,
  aliases: [
    {
      name: apiDomainName.cloudfrontDomainName,
      evaluateTargetHealth: true,
      zoneId: apiDomainName.cloudfrontZoneId,
    },
  ],
});

// Map stage name to custom domain
new aws.apigateway.BasePathMapping(`${stack}-api-domain-mapping`, {
  restApi: apiGateway.restAPI.id,
  domainName: apiDomainName.domainName,
});

export const documentStoreBucketUrl =
  documentStoreBucket.bucket.websiteEndpoint;
export const apigatewayUrl = `https://${config.dvpApiDomain}`;
