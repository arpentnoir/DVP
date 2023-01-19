import { initializeDynamoDataTable } from '@dvp/server-common';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Dynamo } from 'dynamodb-onetable/Dynamo';
import { config } from './config';

const client = new Dynamo({
  client: new DynamoDBClient({
    region: config.awsRegion,
  }),
});

export const models = initializeDynamoDataTable(
  client,
  config.dynamodb.documentsTableName
);
