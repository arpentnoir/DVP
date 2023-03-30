import {
  DocumentSchemasResponseItem,
  DocumentSchemaUpdateRequest,
} from '@dvp/admin-api-client';
import { DocumentSchemaType } from '@dvp/server-common';
import { getMockRes } from '@jest-mock/express';
import schemas from '../../fixtures/document-schemas/schemas.json';
import { getMockRequest } from '../../tests/utils';
import {
  getDocumentSchemas,
  updateDocumentSchema,
} from './document-schema.controller';
import { DocumentSchemaService } from './document-schema.service';

const { res: responseMock, next: nextMock } = getMockRes({ send: jest.fn() });
const schema = schemas[0] as DocumentSchemaType;
describe('document-schema.controller.', () => {
  describe('getDocumentSchemas', () => {
    const query = {
      q: 'co',
      limit: 10,
      cursor: 'next cursor',
      sort: 'desc',
      name: 'COO',
    };
    const mockRequest = getMockRequest(
      '/api/document-schemas',
      'GET',
      null,
      query
    );
    const response = {
      results: schemas as DocumentSchemasResponseItem[],
      pagination: {
        nextCursor: null,
        prevCursor:
          'eyJwayI6IkFibiM0MTE2MTA4MDE0NiIsInNrIjoiRG9jdW1lbnQjMzNkNjY0OTctYTc4Ni00MmM5LWJkZDAtZDVjOWIxMTk5NWE3In0=',
      },
    };
    it('should return list of document schemas', async () => {
      jest
        .spyOn(DocumentSchemaService.prototype, 'getDocumentSchemas')
        .mockResolvedValue(response);

      await getDocumentSchemas(mockRequest, responseMock, nextMock);
      expect(responseMock.json).toBeCalledWith(response);
      expect(
        DocumentSchemaService.prototype.getDocumentSchemas
      ).toHaveBeenCalledWith(query);
    });

    it('should return the error through next function', async () => {
      jest
        .spyOn(DocumentSchemaService.prototype, 'getDocumentSchemas')
        .mockRejectedValue(new Error('error'));

      await getDocumentSchemas(mockRequest, responseMock, nextMock);
      expect(nextMock).toHaveBeenCalledWith(new Error('error'));
    });
  });
  describe('updateDocumentSchema', () => {
    const payload: DocumentSchemaUpdateRequest = {
      disabled: false,
      enableForAll: false,
      disableForABNs: ['32635864970'],
      enableForABNs: ['50110219460', '53930548027'],
    };
    const schemaId = schema.schemaId;

    const mockRequest = getMockRequest(
      `/api/document-schemas/${schemaId}`,
      'GET',
      payload,
      null,
      {
        schemaId,
      }
    );

    it('should update the document schema', async () => {
      jest
        .spyOn(DocumentSchemaService.prototype, 'updateDocumentSchema')
        .mockResolvedValue(schema as never);

      await updateDocumentSchema(mockRequest, responseMock, nextMock);
      expect(responseMock.json).toBeCalledWith(schema);
      expect(
        DocumentSchemaService.prototype.updateDocumentSchema
      ).toHaveBeenCalledWith(schema.schemaId, payload);
    });

    it('should return the error through next function', async () => {
      jest
        .spyOn(DocumentSchemaService.prototype, 'updateDocumentSchema')
        .mockRejectedValue(new Error('error'));

      await updateDocumentSchema(mockRequest, responseMock, nextMock);
      expect(nextMock).toHaveBeenCalledWith(new Error('error'));
    });
  });
});
