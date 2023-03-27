import { DocumentSchemaUpdateRequest } from '@dvp/admin-api-client';
import { DocumentSchemaType } from '@dvp/server-common';
import { getMockRes } from '@jest-mock/express';
import schemas from '../../fixtures/document-schemas/schemas.json';
import { getMockRequest } from '../../tests/utils';
import { updateDocumentSchema } from './document-schema.controller';
import { DocumentSchemaService } from './document-schema.service';

const { res: responseMock, next: nextMock } = getMockRes({ send: jest.fn() });
const schema = schemas[0] as DocumentSchemaType;
describe('document-schema.controller.', () => {
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
