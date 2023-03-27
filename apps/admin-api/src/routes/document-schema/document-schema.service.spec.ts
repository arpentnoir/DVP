import {
  DynamoDBClient,
  QueryCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { DocumentSchemaUpdateRequest } from '@dvp/admin-api-client';
import {
  ApplicationError,
  DocumentSchemaType,
  NotFoundError,
  RequestInvocationContext,
} from '@dvp/server-common';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import schemas from '../../fixtures/document-schemas/schemas.json';
import { getMockRequest } from '../../tests/utils';

import { DocumentSchemaService } from './document-schema.service';

const dynamodbMock = mockClient(DynamoDBClient);

const schema = schemas[0] as DocumentSchemaType;
const schemasDynamo = [
  {
    pk: {
      S: 'DocumentSchema',
    },
    sk: {
      S: `DocumentSchema#${schema.name}#${schema.type}`,
    },
    name: {
      S: schema.name,
    },
    type: {
      S: schema.type,
    },
    schemaId: {
      S: schema.schemaId,
    },
    disabled: {
      BOOL: false,
    },
    disableForABNs: {
      L: [
        {
          S: schema.disableForABNs[0],
        },
        {
          S: schema.disableForABNs[1],
        },
      ],
    },
    enableForABNs: {
      L: [],
    },
    enableForAll: {
      BOOL: false,
    },
  },
];

describe('DocumentSchemaService', () => {
  jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

  beforeEach(() => {
    dynamodbMock.reset();
  });
  const schemaId = schema.schemaId as string;

  describe('updateDocumentSchema', () => {
    const payload: DocumentSchemaUpdateRequest = {
      disabled: false,
      enableForAll: false,
      disableForABNs: ['32635864970'],
      enableForABNs: ['50110219460', '53930548027'],
    };
    const mockRequest = getMockRequest(
      `/api/document-schemas/${schemaId}`,
      'GET',
      payload
    );
    const invocationContext = new RequestInvocationContext(mockRequest);

    it('should throw an error if payload is empty', async () => {
      const documentSchemaService = new DocumentSchemaService(
        invocationContext
      );
      await expect(() =>
        documentSchemaService.updateDocumentSchema(schemaId, {} as never)
      ).rejects.toThrow(new ApplicationError('payload is empty'));
    });

    it('should throw an error if enableForABNs is supplied and enableForAll is true', async () => {
      const documentSchemaService = new DocumentSchemaService(
        invocationContext
      );
      await expect(() =>
        documentSchemaService.updateDocumentSchema(schemaId, {
          enableForAll: true,
          enableForABNs: schema.enableForABNs,
        })
      ).rejects.toThrow(
        new ApplicationError(
          'enableForABNs and enableForAll are mutually exclusive'
        )
      );
    });

    it('should validate the ABNs passed in enableForABNs', async () => {
      const documentSchemaService = new DocumentSchemaService(
        invocationContext
      );
      await expect(() =>
        documentSchemaService.updateDocumentSchema(schemaId, {
          enableForABNs: ['12345678999', '32635864970'],
        })
      ).rejects.toThrow(
        new ApplicationError(
          `Invalid ABNs found in enableForABNs list: ${JSON.stringify([
            '12345678999',
          ])}`
        )
      );
    });

    it('should validate the ABNs passed in disableForABNs', async () => {
      const documentSchemaService = new DocumentSchemaService(
        invocationContext
      );
      await expect(() =>
        documentSchemaService.updateDocumentSchema(schemaId, {
          disableForABNs: ['12345678999', '32635864970'],
        })
      ).rejects.toThrow(
        new ApplicationError(
          `Invalid ABNs found in disableForABNs list: ${JSON.stringify([
            '12345678999',
          ])}`
        )
      );
    });
    it('should throw an error if schema not found', async () => {
      const documentSchemaService = new DocumentSchemaService(
        invocationContext
      );
      dynamodbMock.resolvesOnce({
        Items: [],
      });
      await expect(() =>
        documentSchemaService.updateDocumentSchema(schemaId, {
          disabled: true,
        })
      ).rejects.toThrow(new NotFoundError(schemaId));
    });

    it('should update the document schema', async () => {
      const documentSchemaService = new DocumentSchemaService(
        invocationContext
      );
      dynamodbMock.on(QueryCommand).resolves({
        Items: schemasDynamo,
      });
      dynamodbMock.on(UpdateItemCommand).resolves({
        Attributes: schemasDynamo[0],
      });
      await documentSchemaService.updateDocumentSchema(schemaId, {
        disabled: true,
      });
      expect(dynamodbMock).toHaveReceivedCommandWith(QueryCommand, {
        ConsistentRead: false,
        ExpressionAttributeNames: { '#_0': 'gs1pk', '#_1': 'gs1sk' },
        ExpressionAttributeValues: {
          ':_0': { S: 'DocumentSchema' },
          ':_1': { S: 'DocumentSchema#cb96bba6-52cf-4673-a485-446387a17f37' },
        },
        IndexName: 'gs1',
        KeyConditionExpression: '#_0 = :_0 and begins_with(#_1, :_1)',
        Limit: NaN,
        ScanIndexForward: true,
        TableName: 'documents',
      });

      expect(dynamodbMock).toHaveReceivedCommandWith(UpdateItemCommand, {
        ConditionExpression:
          '(attribute_exists(#_0)) and (attribute_exists(#_1))',
        ExpressionAttributeNames: {
          '#_0': 'pk',
          '#_1': 'sk',
          '#_2': 'updatedBy',
          '#_3': 'disabled',
          '#_4': 'schemaId',
          '#_5': 'name',
          '#_6': 'type',
          '#_7': 'gs1pk',
          '#_8': 'gs1sk',
          '#_9': 'updated',
        },
        ExpressionAttributeValues: {
          ':_0': { S: '1234567890' },
          ':_1': { BOOL: true },
          ':_2': { S: 'cb96bba6-52cf-4673-a485-446387a17f37' },
          ':_3': { S: 'COO' },
          ':_4': { S: 'full' },
          ':_5': { S: 'DocumentSchema' },
          ':_6': { S: 'DocumentSchema#cb96bba6-52cf-4673-a485-446387a17f37' },
          ':_7': { S: '2020-01-01T00:00:00.000Z' },
        },
        Key: {
          pk: { S: 'DocumentSchema' },
          sk: { S: 'DocumentSchema#COO#full' },
        },
        ReturnValues: 'ALL_NEW',
        TableName: 'documents',
        UpdateExpression:
          'set #_2 = :_0, #_3 = :_1, #_4 = :_2, #_5 = :_3, #_6 = :_4, #_7 = :_5, #_8 = :_6, #_9 = :_7',
      });
    });
  });
});
