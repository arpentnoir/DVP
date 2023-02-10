/* eslint-disable @typescript-eslint/no-explicit-any */
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { kms } from '../common';
import { dynamodbDocumentsTable } from '../common/dynamodb';

import * as vpc from '../common/vpc';
import { lambdaRole } from './roles/lambdaRole';

const stack = pulumi.getStack();

const buildDir = '../../artifacts/schema-worker-build'; // directory for content files

////////////////////////////////////////////////////////////////////////////////
// Enviroment variables for Lambda functions
const environmentVariables = {
  variables: {
    DYNAMODB_DOCUMENTS_TABLE: dynamodbDocumentsTable.name,
  },
};

////////////////////////////////////////////////////////////////////////////////
// Lambda role policy attachments
new aws.iam.RolePolicyAttachment(
  `${stack}-schema-worker-lambda-execute-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaExecute,
  }
);

new aws.iam.RolePolicyAttachment(
  `${stack}-schema-worker-lambda-sqs-queue-execute-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaSQSQueueExecutionRole,
  }
);

new aws.iam.RolePolicyAttachment(
  `${stack}-schema-worker-lambda-xray-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSXrayWriteOnlyAccess,
  }
);

const dynamodbLambdaPolicy = new aws.iam.Policy(
  `${stack}-schema-worker-dynamodb-lambda-policy`,
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
            'dynamodb:DeleteItem'
          ],
          Resource: dynamodbDocumentsTable.arn,
        },
      ],
    },
  }
);

new aws.iam.RolePolicyAttachment(`${stack}-schema-worker-lambda-dynamodb`, {
  role: lambdaRole.name,
  policyArn: dynamodbLambdaPolicy.arn,
});

new aws.iam.RolePolicyAttachment(
  `${stack}-schema-worker-lambda-vpc-execution-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaVPCAccessExecutionRole,
  }
);

const kmsLambdaPolicy = new aws.iam.Policy(
  `${stack}-schema-worker-kms-lambda-policy`,
  {
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
  }
);

new aws.iam.RolePolicyAttachment(
  `${stack}-schema-worker-kms-policy-attachment`,
  {
    role: lambdaRole.name,
    policyArn: kmsLambdaPolicy.arn,
  }
);

////////////////////////////////////////////////////////////////////////////////
// Lambda functions for apis
export const lambdaSchemaWorkerHandler = new aws.lambda.Function(
  `${stack}-schema-worker`,
  {
    memorySize: 512,
    role: lambdaRole.arn,
    code: new pulumi.asset.FileArchive(buildDir),
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
  }
);

export const schemaWorkerSqsMapping = new aws.lambda.EventSourceMapping(
  `${stack}-schema-worker-sqs-mapping`,
  {
    eventSourceArn: `arn:aws:sqs:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:dvp-${process.env.ENV}-credential-schemas-event-queue`,
    functionName: lambdaSchemaWorkerHandler.arn,
  },
  {
    dependsOn: [lambdaSchemaWorkerHandler],
  }
);
