import * as aws from '@pulumi/aws';

// Create an IAM Role for the lambda function
export const lambdaRole = new aws.iam.Role('schemaWorkerLambdaRole', {
  assumeRolePolicy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'iamRoleForSchemaWorkerLambda',
        Action: 'sts:AssumeRole',
        Principal: {
          Service: 'lambda.amazonaws.com',
        },
        Effect: 'Allow',
      },
    ],
  }),
});
