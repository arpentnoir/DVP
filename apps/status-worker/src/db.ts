import { initializeDynamoDataTable } from '@dvp/server-common';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Dynamo } from 'dynamodb-onetable/Dynamo';
import { config } from './config';

// Configure the Dynamo DB Client. Use Localstack configuration if the Localstack flag is present in the environment,
// otherwise use the default configuration for connecting to AWS
const dynamoDbClient =
  process.env.ENABLE_LOCALSTACK === 'true'
    ? new DynamoDBClient({
        region: process.env.LOCALSTACK_DYNAMO_DB_AWS_REGION,
        endpoint: process.env.LOCALSTACK_ENDPOINT,
      })
    : new DynamoDBClient({
        region: config.awsRegion,
      });

const client = new Dynamo({
  client: dynamoDbClient,
});

export const models = initializeDynamoDataTable(
  client,
  config.dynamodb.documentsTableName
);
