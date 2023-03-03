import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { dvpVpcId } from './vpc';

const stack = pulumi.getStack();

const { ENV, AWS_REGION } = process.env;

export const dynamodbDocumentsTable = new aws.dynamodb.Table(
  `dvp-${ENV}-documents`,
  {
    attributes: [
      {
        name: 'pk',
        type: 'S',
      },
      {
        name: 'sk',
        type: 'S',
      },
      {
        name: 'gs1pk',
        type: 'S',
      },
      {
        name: 'gs1sk',
        type: 'S',
      },
      {
        name: 'gs2pk',
        type: 'S',
      },
      {
        name: 'gs2sk',
        type: 'S',
      },
    ],
    hashKey: 'pk',
    rangeKey: 'sk',
    billingMode: 'PAY_PER_REQUEST',
    ttl: {
      attributeName: 'ttl',
      enabled: true,
    },
    globalSecondaryIndexes: [
      {
        hashKey: 'gs1pk',
        name: 'gs1',
        rangeKey: 'gs1sk',
        projectionType: 'ALL',
      },
      {
        hashKey: 'gs2pk',
        name: 'gs2',
        rangeKey: 'gs2sk',
        projectionType: 'ALL',
      },
    ],
  }
);

export const dynamodbVpcEndpoint = new aws.ec2.VpcEndpoint(
  `${stack}-dynamodb-vpc-endpoint`,
  {
    vpcId: dvpVpcId,
    serviceName: `com.amazonaws.${AWS_REGION}.dynamodb`,
  }
);
