import { getMockReq, getMockRes } from '@jest-mock/express';
import { getCredentials } from './credentials.controller';
import { CredentialService } from './credentials.service';

const { res: responseMock, next: nextMock } = getMockRes({ send: jest.fn() });
const response = {
  results: [
    {
      id: '26d255c9-a86c-4c06-8d61-719fa72ed755',
      consignmentReferenceNumber: '3344555',
      documentDeclaration: true,
      documentNumber: '1234',
      exporterOrManufacturerAbn: '1223333',
      freeTradeAgreement: 'AANZFTA',
      importerName: 'Test',
      importingJurisdiction: 'Australia',
    },
    {
      id: '26aa4b64-d2ac-4a65-bff6-90ff2b999703',
      consignmentReferenceNumber: 'dbschenker.com:hawb:DBS626578',
      documentNumber: '23343',
      exporterOrManufacturerAbn: 'abr.gov.au:abn:55004094599',
      importerName: 'East meets west fine wines',
      importingJurisdiction: 'Singapore',
    },
  ],
  pagination: {
    nextCursor: null,
    prevCursor:
      'eyJwayI6IkFibiM0MTE2MTA4MDE0NiIsInNrIjoiRG9jdW1lbnQjMzNkNjY0OTctYTc4Ni00MmM5LWJkZDAtZDVjOWIxMTk5NWE3In0=',
  },
};
describe('credentials.controller', () => {
  it('should return list of credentials', async () => {
    jest
      .spyOn(CredentialService.prototype, 'getCredentials')
      .mockResolvedValue(response);

    const mockRequest = getMockReq({
      method: 'GET',
      headers: {
        'Correlation-ID': 'NUMPTYHEAD1',
      },
      query: {
        q: 'Australia',
        limit: 10 as any,
        cursor: 'next cursor',
        sort: 'desc',
      },
    });

    mockRequest.route = { path: '/api/credentials' };
    await getCredentials(mockRequest, responseMock, nextMock);
    expect(responseMock.json).toBeCalledWith(response);
  });
});
