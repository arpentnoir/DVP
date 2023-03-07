import { DocumentSchemasResponseItem } from '@dvp/api-client';
import { getMockRes } from '@jest-mock/express';
import schemas from '../../fixtures/document-schemas/schemas.json';
import { getMockRequest } from '../../tests/utils';
import { getDocumentSchemas } from './document-schema.controller';
import { DocumentSchemaService } from './document-schema.service';

const { res: responseMock, next: nextMock } = getMockRes({ send: jest.fn() });
const response = {
  results: schemas as DocumentSchemasResponseItem[],
  pagination: {
    nextCursor: null,
    prevCursor:
      'eyJwayI6IkFibiM0MTE2MTA4MDE0NiIsInNrIjoiRG9jdW1lbnQjMzNkNjY0OTctYTc4Ni00MmM5LWJkZDAtZDVjOWIxMTk5NWE3In0=',
  },
};
describe('document-schema.controller.', () => {
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
