import * as aws from "@pulumi/aws";

// Create region level role and policy.  This is required to enable cloudwatch logs
export const cloudWatchRole = new aws.iam.Role("cloudWatchRole", {
  assumeRolePolicy: `{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "",
        "Effect": "Allow",
        "Principal": {
          "Service": "apigateway.amazonaws.com"
        },
      "Action": "sts:AssumeRole"
      }
    ]
  }`
});
const cloudWatchAccount = new aws.apigateway.Account("cloudWatchAccount", {cloudwatchRoleArn: cloudWatchRole.arn});
const cloudWatchRolePolicy = new aws.iam.RolePolicy("cloudWatchRolePolicy", {
    role: cloudWatchRole.id,
    policy: `{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Action": [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents",
          "logs:GetLogEvents",
          "logs:FilterLogEvents"
        ],
        "Resource": "*"
      }]
    }`,
});