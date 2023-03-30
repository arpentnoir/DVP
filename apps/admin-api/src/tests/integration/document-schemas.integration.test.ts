import {
  DocumentSchemasResponseItem,
  DocumentSchemaUpdateRequest,
} from '@dvp/admin-api-client';
import { decode, DocumentSchemaType } from '@dvp/server-common';
import request from 'supertest';
import { app } from '../../app';
import { models } from '../../db';
import schemas from '../../fixtures/document-schemas/schemas.json';
import { DocumentSchemasQueryParams } from '../../routes/document-schema/document-schema.service';
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

const documentSchemas = {
  results: schemas?.map((schema) => {
    const { uiSchemaPath, schemaPath, ...item } = schema;
    return item;
  }) as DocumentSchemasResponseItem[],
  pagination: {
    limit: 10,
    nextCursor:
      'eyJwayI6IkRvY3VtZW50U2NoZW1hIiwic2siOiJEb2N1bWVudFNjaGVtYSNDT08jIn0=',
    prevCursor:
      'eyJwayI6IkRvY3VtZW50U2NoZW1hIiwic2siOiJEb2N1bWVudFNjaGVtYSNDT08jIn0=',
  },
};

describe('document schemas api', () => {
  const endpoint = '/v1/document-schemas';
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('GET /v1/document-schemas', () => {
    beforeEach(() => {
      (models.DocumentSchema.find as jest.Mock).mockClear();
    });

    it('should list document schemas', async () => {
      const debRes = documentSchemas.results;
      debRes['next'] = JSON.parse(
        decode(documentSchemas.pagination.nextCursor)
      );
      debRes['prev'] = JSON.parse(
        decode(documentSchemas.pagination.prevCursor)
      );

      (models.DocumentSchema.find as jest.Mock).mockResolvedValueOnce(debRes);
      const query: DocumentSchemasQueryParams = {
        q: 'co',
        limit: 10,
        nextCursor:
          'eyJwayI6IkRvY3VtZW50U2NoZW1hIiwic2siOiJEb2N1bWVudFNjaGVtYSNDT08jIn0=',
        sort: 'desc',
        name: 'COO',
      };
      await request(app)
        .get(endpoint)
        .query(query)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.results).toEqual(
            expect.arrayContaining(documentSchemas.results)
          );
          expect(res.body.pagination).toEqual(
            expect.objectContaining(documentSchemas.pagination)
          );

          expect(models.DocumentSchema.find).toHaveBeenCalledWith(
            {
              pk: 'DocumentSchema',
              sk: { begins: 'DocumentSchema#COO#' },
            },
            {
              fields: ['name', 'type'],
              limit: 10,
              next: { pk: 'DocumentSchema', sk: 'DocumentSchema#COO#' },
              reverse: true,
              substitutions: { q: 'co' },
              where: '(contains(${name}, @{q})) or (contains(${type}, @{q}))',
            }
          );
        });
    });

    it.each`
      field           | val       | statusCode
      ${'limit'}      | ${'test'} | ${400}
      ${'limit'}      | ${200}    | ${400}
      ${'nextCursor'} | ${'test'} | ${422}
      ${'prevCursor'} | ${'test'} | ${422}
    `(
      'returns $statusCode when $field is set to $val',
      async ({ field, val, statusCode }) => {
        await request(app)
          .get(endpoint)
          .query({
            [field]: val,
          })
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect('Content-Type', /json/)
          .expect(statusCode as number)
          .expect((res) => {
            expect(res.body.errors).toBeDefined();
          });
      }
    );
  });

  describe('PUT /v1/document-schemas/:schemaId', () => {
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
          const { uiSchemaPath, schemaPath, ...otherAttributes } =
            documentSchema;
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
});
