/* eslint-disable @typescript-eslint/no-explicit-any */
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { kms } from '../common';
import { dynamodbDocumentsTable } from '../common/dynamodb';
import { environmentVariables } from '../api';

import * as vpc from '../common/vpc';
import { lambdaRole } from './roles/lambdaRole';

const stack = pulumi.getStack();

const buildDir = '../../artifacts/status-worker-build'; // directory for content files

////////////////////////////////////////////////////////////////////////////////
// Lambda role policy attachments
new aws.iam.RolePolicyAttachment(
  `${stack}-status-worker-lambda-execute-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaExecute,
  }
);

new aws.iam.RolePolicyAttachment(
  `${stack}-status-worker-lambda-sqs-queue-execute-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaSQSQueueExecutionRole,
  }
);

new aws.iam.RolePolicyAttachment(
  `${stack}-status-worker-lambda-xray-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSXrayWriteOnlyAccess,
  }
);

const dynamodbLambdaPolicy = new aws.iam.Policy(
  `${stack}-status-worker-dynamodb-lambda-policy`,
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

new aws.iam.RolePolicyAttachment(`${stack}-status-worker-lambda-dynamodb`, {
  role: lambdaRole.name,
  policyArn: dynamodbLambdaPolicy.arn,
});

new aws.iam.RolePolicyAttachment(
  `${stack}-status-worker-lambda-vpc-execution-attachment`,
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaVPCAccessExecutionRole,
  }
);

const kmsLambdaPolicy = new aws.iam.Policy(
  `${stack}-status-worker-kms-lambda-policy`,
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
  `${stack}-status-worker-kms-policy-attachment`,
  {
    role: lambdaRole.name,
    policyArn: kmsLambdaPolicy.arn,
  }
);

////////////////////////////////////////////////////////////////////////////////
// Lambda functions for apis
export const lambdastatusWorkerHandler = new aws.lambda.Function(
  `${stack}-status-worker`,
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

export const statusWorkerSqsMapping = new aws.lambda.EventSourceMapping(
  `${stack}-status-worker-sqs-mapping`,
  {
    eventSourceArn: `arn:aws:sqs:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:dvp-${process.env.ENV}-credential-status-event-queue`,
    functionName: lambdastatusWorkerHandler.arn,
    batchSize: 1,
  },
  {
    dependsOn: [lambdastatusWorkerHandler],
  }
);
