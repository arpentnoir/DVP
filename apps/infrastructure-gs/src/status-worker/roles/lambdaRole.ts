import * as aws from '@pulumi/aws';

// Create an IAM Role for the lambda function
export const lambdaRole = new aws.iam.Role('statusWorkerLambdaRole', {
  assumeRolePolicy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'iamRoleForStatusWorkerLambda',
        Action: 'sts:AssumeRole',
        Principal: {
          Service: 'lambda.amazonaws.com',
        },
        Effect: 'Allow',
      },
    ],
  }),
});
