import { DocumentSchemasResponseItem } from '@dvp/api-client';
import { decode } from '@dvp/server-common';
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
      },
    },
  };
});

const documentSchemas = {
  results: schemas as DocumentSchemasResponseItem[],
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
    (models.DocumentSchema.find as jest.Mock).mockClear();
  });

  it('should list document schemas', async () => {
    const debRes = documentSchemas.results;
    debRes['next'] = JSON.parse(decode(documentSchemas.pagination.nextCursor));
    debRes['prev'] = JSON.parse(decode(documentSchemas.pagination.prevCursor));

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
