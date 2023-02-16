import { decode } from '@dvp/server-common';
import request from 'supertest';
import { app } from '../../app';
import { models } from '../../db';
import { authTokenWithSubAndAbn } from './utils';
jest.mock('../../db', () => {
  return {
    models: {
      Document: {
        find: jest.fn(),
      },
    },
  };
});

const credentials = {
  results: [
    {
      id: '26d255c9-a86c-4c06-8d61-719fa72ed751',
      consignmentReferenceNumber: '3344555',
      documentDeclaration: true,
      documentNumber: '1234',
      exporterOrManufacturerAbn: '1223333',
      freeTradeAgreement: 'AANZFTA',
      importerName: 'Test',
      importingJurisdiction: 'Australia',
      expiryDate: '2023-01-01',
      issueDate: '2025-01-01',
    },
    {
      id: '26d255c9-a86c-4c06-8d61-719fa72ed755',
      consignmentReferenceNumber: '3344555',
      documentDeclaration: true,
      documentNumber: '1234',
      exporterOrManufacturerAbn: '1223333',
      freeTradeAgreement: 'AANZFTA',
      importerName: 'Test',
      importingJurisdiction: 'Australia',
      expiryDate: '2023-01-01',
      issueDate: '2025-01-01',
    },
  ],
  pagination: {
    limit: 10,
    nextCursor:
      'eyJwayI6IkFibiM0MTE2MTA4MDE0NiIsInNrIjoiRG9jdW1lbnQjMzNkNjY0OTctYTc4Ni00MmM5LWJkZDAtZDVjOWIxMTk5NWE3In0=',
    prevCursor:
      'eyJwayI6IkFibiM0MTE2MTA4MDE0NiIsInNrIjoiRG9jdW1lbnQjMzNkNjY0OTctYTc4Ni00MmM5LWJkZDAtZDVjOWIxMTk5NWE3In0=',
  },
};

describe('credentials api', () => {
  const endpoint = '/api/credentials';

  beforeEach(() => {
    (models.Document.find as jest.Mock).mockClear();
  });

  it('should list issued credentials', async () => {
    const debRes = credentials.results;
    debRes['next'] = JSON.parse(decode(credentials.pagination.nextCursor));
    debRes['prev'] = JSON.parse(decode(credentials.pagination.prevCursor));

    (models.Document.find as jest.Mock).mockResolvedValueOnce(debRes);

    await request(app)
      .get(endpoint)
      .query({
        q: 'Australia',
        limit: 10,
        nextCursor:
          'eyJwayI6IkFibiM0MTE2MTA4MDE0NiIsInNrIjoiRG9jdW1lbnQjMzNkNjY0OTctYTc4Ni00MmM5LWJkZDAtZDVjOWIxMTk5NWE3In0=',
        sort: 'desc' as 'desc' | 'asc',
      })
      .set({ Authorization: authTokenWithSubAndAbn })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.results).toEqual(
          expect.arrayContaining(credentials.results)
        );
        expect(res.body.pagination).toEqual(
          expect.objectContaining(credentials.pagination)
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
    'returns $expected when $a is added to $b',
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
