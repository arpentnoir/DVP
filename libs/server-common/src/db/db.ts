import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Table } from 'dynamodb-onetable';
import { DynamoSchema } from './schema';

/*
  Single-table schema and setup.
*/
export const initializeDynamoDataTable = (
  dynamoClient: DynamoDBClient,
  tableName: string
) => {
  const table = new Table({
    name: tableName,
    client: dynamoClient,
    logger: true,
    partial: false,

    schema: DynamoSchema,
  });

  return {
    Document: table.getModel('Document'),
  };
};
