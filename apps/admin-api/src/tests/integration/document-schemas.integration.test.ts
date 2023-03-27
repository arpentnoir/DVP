import { DocumentSchemaUpdateRequest } from '@dvp/admin-api-client';
import { DocumentSchemaType } from '@dvp/server-common';
import request from 'supertest';
import { app } from '../../app';
import { models } from '../../db';
import schemas from '../../fixtures/document-schemas/schemas.json';
import { authTokenWithSubAndAbn } from '../utils';

jest.mock('../../db', () => {
  return {
    models: {
      DocumentSchema: {
        find: jest.fn(),
        update: jest.fn(),
      },
    },
  };
});

const documentSchema = schemas[0] as DocumentSchemaType;

describe('document schemas api', () => {
  const endpoint = '/v1/document-schemas';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should update the document schema', async () => {
    (models.DocumentSchema.find as jest.Mock).mockResolvedValue(schemas);
    (models.DocumentSchema.update as jest.Mock).mockResolvedValue(schemas[0]);

    const payload: DocumentSchemaUpdateRequest = {
      disabled: false,
      enableForAll: false,
      disableForABNs: ['32635864970'],
      enableForABNs: ['50110219460', '53930548027'],
    };
    await request(app)
      .put(`${endpoint}/${documentSchema.schemaId}`)
      .send(payload)
      .set({ Authorization: authTokenWithSubAndAbn })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        const { uiSchemaPath, schemaPath, ...otherAttributes } = documentSchema;
        expect(res.body).toEqual(expect.objectContaining(otherAttributes));
        expect(models.DocumentSchema.find).toHaveBeenLastCalledWith(
          {
            gs1pk: 'DocumentSchema',
            gs1sk: {
              begins: 'DocumentSchema#cb96bba6-52cf-4673-a485-446387a17f37',
            },
          },
          {
            index: 'gs1',
            limit: 1,
          }
        );
        expect(models.DocumentSchema.update).toHaveBeenCalledWith(
          {
            schemaId: 'cb96bba6-52cf-4673-a485-446387a17f37',
            name: 'COO',
            type: 'full',
          },
          {
            set: {
              disableForABNs: ['32635864970'],
              disabled: false,
              enableForABNs: ['50110219460', '53930548027'],
              enableForAll: false,
              updatedBy: '1234567890',
            },
          }
        );
      });
  });

  it('should return not found error when schema is not found', async () => {
    (models.DocumentSchema.find as jest.Mock).mockResolvedValue([]);

    const payload: DocumentSchemaUpdateRequest = {
      disabled: false,
      enableForAll: false,
      disableForABNs: ['32635864970'],
      enableForABNs: ['50110219460', '53930548027'],
    };
    await request(app)
      .put(`${endpoint}/${documentSchema.schemaId}`)
      .send(payload)
      .set({ Authorization: authTokenWithSubAndAbn })
      .expect('Content-Type', /json/)
      .expect(404)
      .expect((res) => {
        expect(res.body.errors[0].code).toBe('NotFound');
      });
  });

  it.each`
    payload                                            | statusCode
    ${{}}                                              | ${400}
    ${{ enableForAll: true, enableForABNs: ['test'] }} | ${400}
    ${{ enableForABNs: ['123456'] }}                   | ${400}
    ${{ disableForABNs: ['123456'] }}                  | ${400}
  `(
    'returns $statusCode when the payload is $payload',
    async ({
      payload,
      statusCode,
    }: {
      payload: DocumentSchemaUpdateRequest;
      statusCode: number;
    }) => {
      await request(app)
        .put(`${endpoint}/${documentSchema.schemaId}`)
        .send(payload)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .expect(statusCode)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    }
  );
});
