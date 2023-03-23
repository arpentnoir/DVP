import { initializeDynamoDataTable } from '@dvp/server-common';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Dynamo } from 'dynamodb-onetable/Dynamo';
import { config } from './config';
 
/**
 * Configure the Dynamo DB Client. Use Localstack configuration if the Localstack flag is present in the environment, 
 * otherwise use the default configuration for connecting to AWS.
 * 
 * Note: For Localstack, the DyanamoDB region needs to be set to us-east-1 - not ap-southeast-2 like everything else - 
 * therefore we use a separeate env property to capture this.
 */
const dynamoDbClient =
  process.env.ENABLE_LOCALSTACK === 'true'
    ? new DynamoDBClient({
      region: process.env.LOCALSTACK_DYNAMO_DB_AWS_REGION, 
      endpoint: process.env.LOCALSTACK_ENDPOINT
    })
    : new DynamoDBClient({
      region: config.awsRegion,
    });

const client = new Dynamo({
  client: dynamoDbClient,
});

/** Obtain a handle to the models (i.e. Document, DocumentSchema ) configured in DynamoDB */ 
export const models = initializeDynamoDataTable(
  client,
  config.dynamodb.documentsTableName
);
