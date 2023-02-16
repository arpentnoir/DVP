import {
  decode,
  QueryParameterError,
  RequestInvocationContext,
} from '@dvp/server-common';
import { getMockReq } from '@jest-mock/express';
import { models } from './../../db';
import { CredentialService } from './credentials.service';

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
describe('credentials.service', () => {
  const mockRequest = getMockReq({
    method: 'POST',
    headers: {
      'Correlation-ID': 'NUMPTYHEAD1',
    },
  });

  mockRequest.route = { path: '/api/credentials' };
  const invocationContext = new RequestInvocationContext(mockRequest);

  beforeEach(() => {
    (models.Document.find as jest.Mock).mockClear();
  });

  it('should list issued credentials', async () => {
    const debRes = credentials.results;
    debRes['next'] = JSON.parse(decode(credentials.pagination.nextCursor));
    debRes['prev'] = JSON.parse(decode(credentials.pagination.prevCursor));

    (models.Document.find as jest.Mock).mockResolvedValueOnce(debRes);

    const credentialService = new CredentialService(invocationContext);
    const query = {
      q: 'Australia',
      limit: 10,
      nextCursor:
        'eyJwayI6IkFibiM0MTE2MTA4MDE0NiIsInNrIjoiRG9jdW1lbnQjMzNkNjY0OTctYTc4Ni00MmM5LWJkZDAtZDVjOWIxMTk5NWE3In0=',
      sort: 'desc' as 'desc' | 'asc',
    };
    const res = await credentialService.getCredentials(query);
    expect(res.results).toEqual(expect.arrayContaining(credentials.results));
    expect(res.pagination).toEqual(
      expect.objectContaining(credentials.pagination)
    );
  });

  it('should validate nextCursor and throw error if invalid', async () => {
    const credentialService = new CredentialService(invocationContext);
    const query = {
      nextCursor: 'test',
    };
    await expect(credentialService.getCredentials(query)).rejects.toThrowError(
      new QueryParameterError('nextCursor', 'test')
    );
  });

  it('should validate prevCursor and throw error if invalid', async () => {
    const credentialService = new CredentialService(invocationContext);
    const query = {
      prevCursor: 'test',
    };
    await expect(credentialService.getCredentials(query)).rejects.toThrowError(
      new QueryParameterError('prevCursor', 'test')
    );
  });
});
