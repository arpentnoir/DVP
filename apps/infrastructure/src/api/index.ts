/* eslint-disable @typescript-eslint/no-explicit-any */
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import { kms } from '../common';

import * as documentDB from '../common/documentDb';
import * as vpc from '../common/vpc';
import { config } from './config';
import { bucketPolicy } from './policies/s3Policies';
import { lambdaRole } from './roles/lambdaRole';

const stack = pulumi.getStack();

const apiDir = '../../artifacts/api-build'; // directory for content files

////////////////////////////////////////////////////////////////////////////////
// Log group for api
const apiLogGroup = new aws.cloudwatch.LogGroup(`${stack}-api-log-group`);

////////////////////////////////////////////////////////////////////////////////
// S3 bucket for document store
const documentStoreBucket = new aws.s3.Bucket(`${stack}-document-store`, {
  bucket: `${stack}-document-store`,
});

// Set the access policy for the bucket
new aws.s3.BucketPolicy('documentStoreBucketPolicy', {
  bucket: documentStoreBucket.bucket,
  policy: pulumi
    .all([documentStoreBucket.bucket, lambdaRole.arn])
    .apply(([bucket, arn]: Array<any>) => bucketPolicy(bucket, arn)),
});

////////////////////////////////////////////////////////////////////////////////
// Enviroment variables for Lambda functions

const databaseUrl = pulumi
  .all([
    documentDB.schemaRegistryDocumentDbMasterPassword.result,
    documentDB.schemaRegistryDocumentDbCluster.masterUsername,
    documentDB.schemaRegistryDocumentDbCluster.endpoint,
    documentDB.schemaRegistryDocumentDbCluster.port,
  ])
  .apply(([password, username, endpoint, port]: Array<any>) => {
    const urlParams = new URLSearchParams(config.databaseOptions).toString();
    return `mongodb://${username}:${encodeURIComponent(
      password
    )}@${endpoint}:${port}/?${urlParams}`;
  });

const enviromentVariables = {
  variables: {
    DOCUMENT_STORAGE_BUCKET_NAME: documentStoreBucket.bucket,
    S3_REGION: documentStoreBucket.region,
    DATABASE_URL: databaseUrl,
    CONFIGFILE_DATABASE_COLLECTION_NAME: config.databaseCollectionName,
    DATABASE_SERVER_SELECTION_TIMEOUT: config.databaseServerSelectionTimeout,
    KMS_MASTER_KEY_ID: kms.kmsCmkAlias.targetKeyArn,
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
  `${stack}-api--handler-lambda-xray-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSXrayWriteOnlyAccess,
  }
);

new aws.iam.RolePolicyAttachment(
  `${stack}-api-handler-lambda-vpc-execution-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaVPCAccessExecutionRole,
  }
);

const kmsLambdaPolicy = new aws.iam.Policy(`${stack}-kms-Lambda-Policy`, {
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
  environment: { ...enviromentVariables },
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
const apiGateway = new awsx.apigateway.API(`${stack}-api`, {
  restApiArgs: {
    endpointConfiguration: {
      types: 'EDGE',
    },
  },
  routes: [
    {
      path: '/{proxy+}',
      method: 'ANY',
      eventHandler: lambdaApiHandler,
    },
  ],
  stageName: `${stack}-api`,
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
      domain: config.dvpApiDomain,
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
  stageName: apiGateway.stage.stageName,
  domainName: apiDomainName.domainName,
});

export const documentStoreBucketUrl = documentStoreBucket.websiteEndpoint;
export const apigatewayUrl = `https://${config.dvpApiDomain}`;
