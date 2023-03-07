import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import {
  ApplicationError,
  QueryParameterError,
  RequestInvocationContext,
} from '@dvp/server-common';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import schemas from '../../fixtures/document-schemas/schemas.json';
import { getMockRequest } from '../../tests/utils';

import {
  DocumentSchemaService,
  DocumentSchemasQueryParams,
} from './document-schema.service';

const dynamodbMock = mockClient(DynamoDBClient);

const schemasDynamo = schemas?.map(
  ({ type, name }: { type: string; name: string }) => ({
    pk: {
      S: 'DocumentSchema',
    },
    sk: {
      S: `DocumentSchema#${name}#${type}`,
    },
    name: {
      S: name,
    },
    type: {
      S: type,
    },
  })
);

describe('DocumentSchemaService', () => {
  beforeEach(() => {
    dynamodbMock.reset();
  });

  describe('getDocumentSchemas', () => {
    const query: DocumentSchemasQueryParams = {
      q: 'co',
      limit: 10,
      nextCursor:
        'eyJwayI6IkRvY3VtZW50U2NoZW1hIiwic2siOiJEb2N1bWVudFNjaGVtYSNDT08jIn0=',
      sort: 'desc',
      name: 'COO',
      type: 'full',
    };
    const mockRequest = getMockRequest(
      '/api/document-schemas',
      'GET',
      null,
      query
    );
    const invocationContext = new RequestInvocationContext(mockRequest);

    it.each`
      cursor          | value
      ${'nextCursor'} | ${'test'}
      ${'prevCursor'} | ${'test'}
    `(
      'throws error when $cursor is invalid',
      async ({ cursor, value }: { cursor: string; value: string }) => {
        const documentSchemaService = new DocumentSchemaService(
          invocationContext
        );
        dynamodbMock.rejectsOnce('fails');
        await expect(() =>
          documentSchemaService.getDocumentSchemas({
            [cursor]: value,
          })
        ).rejects.toThrow(new QueryParameterError(cursor, value));
      }
    );

    it('should throw an error if fails to fetch from the database', async () => {
      const documentSchemaService = new DocumentSchemaService(
        invocationContext
      );
      dynamodbMock.rejectsOnce('fails');
      await expect(() =>
        documentSchemaService.getDocumentSchemas(query)
      ).rejects.toThrow(
        new ApplicationError('Error fetching the document schemas')
      );
    });

    it('should list the available document schemas', async () => {
      const documentSchemaService = new DocumentSchemaService(
        invocationContext
      );
      dynamodbMock.on(QueryCommand).resolvesOnce({
        Items: schemasDynamo,
      });

      const res = await documentSchemaService.getDocumentSchemas(query);
      expect(dynamodbMock).toHaveReceivedCommandWith(QueryCommand, {
        ConsistentRead: false,
        ExclusiveStartKey: {
          pk: { S: 'DocumentSchema' },
          sk: { S: 'DocumentSchema#COO#' },
        },
        ExpressionAttributeNames: {
          '#_0': 'name',
          '#_1': 'type',
          '#_2': 'pk',
          '#_3': 'sk',
        },
        ExpressionAttributeValues: {
          ':_0': { S: 'co' },
          ':_1': { S: 'DocumentSchema' },
          ':_2': { S: 'DocumentSchema#COO#' },
        },
        FilterExpression: '(contains(#_0, :_0)) or (contains(#_1, :_0))',
        KeyConditionExpression: '#_2 = :_1 and begins_with(#_3, :_2)',
        ProjectionExpression: '#_0, #_1',
        ScanIndexForward: false,
        TableName: 'documents',
      });
      expect(res).toMatchObject({
        results: schemas,
        pagination: {
          limit: 10,
          nextCursor: null,
          prevCursor:
            'eyJwayI6IkRvY3VtZW50U2NoZW1hIiwic2siOiJEb2N1bWVudFNjaGVtYSNDT08jZnVsbCJ9',
        },
      });
    });
  });
});
