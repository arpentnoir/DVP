/* eslint-disable @typescript-eslint/require-await */
import { VerifiableCredential } from '@dvp/api-interfaces';
import { API_ENDPOINTS } from '../constants';
import { QueryFunctionOptions } from '../hooks';
import { CHAFTA_COO, SVIP_CHAFTA_COO } from '../mocks/fixtures/documents';
import { axiosInstance } from './api.service';
import {
  getOAMetaData,
  getVerifiableCredentials,
  _getIssuer,
} from './vc.service';
jest.spyOn(axiosInstance, 'get');

const mockAxiosGetRequest = axiosInstance.get as jest.Mock;

const mockQueryOptions = {
  pagination: {
    nextCursor: null,
    prevCursor: null,
    limit: '50',
  },
  sort: 'asc',
} as QueryFunctionOptions;

const mockQueryResponse = {
  results: [],
  pagination: { nextCursor: null, prevCursor: null, limit: '50' },
};

describe('VcServices', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('_getIssuer', () => {
    describe('OA', () => {
      it('should return issuer if present in document', () => {
        const issuer = _getIssuer(CHAFTA_COO as VerifiableCredential);

        expect(issuer).toStrictEqual({
          id: 'demo-tradetrust.openattestation.com',
        });
      });

      it('should return undefined if issuer is not present in document', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { openAttestationMetadata, ...withoutIssuer } = CHAFTA_COO;
        const iss = _getIssuer(withoutIssuer as never);

        expect(iss).toStrictEqual({ id: undefined });
      });
    });
    describe('SVIP', () => {
      it('should return issuer if present in document', () => {
        const issuer = _getIssuer(SVIP_CHAFTA_COO as VerifiableCredential);

        expect(issuer).toStrictEqual({
          id: 'did:key:z6MkvsJoJF1ucfDbqVsbmTnxypFYCLAKZSuCMjPv4a3yLG3u',
        });
      });

      it('should return  undefined if issuer is not present in document', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { issuer, ...withoutIssuer } = SVIP_CHAFTA_COO;
        const iss = _getIssuer(withoutIssuer as never);

        expect(iss).toStrictEqual({ id: undefined });
      });
    });
  });

  describe('getOAMetaData', () => {
    it('should return oa meta data with partial template name', () => {
      const response = getOAMetaData('AANZFTACoO', 'partial');
      expect(response.openAttestationMetadata.template.name).toEqual(
        'AANZFTACoOPartial'
      );
    });
    it('should return oa meta data with default template name', () => {
      const response = getOAMetaData('AANZFTACoO', 'full');
      expect(response.openAttestationMetadata.template.name).toEqual(
        'AANZFTACoO'
      );
    });
  });

  describe('getVerifiableCredentials', () => {
    it('should make a request to the credentials endpoint', async () => {
      mockAxiosGetRequest.mockImplementationOnce(async () => ({
        data: mockQueryResponse,
      }));

      const response = await getVerifiableCredentials(
        'query',
        mockQueryOptions
      );

      const searchParams = new URLSearchParams({
        q: encodeURIComponent('query'),
        limit: mockQueryOptions.pagination.limit,
        sort: mockQueryOptions.sort,
      }).toString();

      expect(mockAxiosGetRequest).toHaveBeenCalledWith(
        `${API_ENDPOINTS.CREDENTIALS}?${searchParams}`
      );
      expect(response).toStrictEqual(mockQueryResponse);
    });

    it('should encode the query param', async () => {
      mockAxiosGetRequest.mockImplementationOnce(async () => ({
        data: mockQueryResponse,
      }));

      const response = await getVerifiableCredentials(
        'query param',
        mockQueryOptions
      );

      const searchParams = new URLSearchParams({
        q: encodeURIComponent('query param'),
        limit: mockQueryOptions.pagination.limit,
        sort: mockQueryOptions.sort,
      }).toString();

      expect(mockAxiosGetRequest).toHaveBeenCalledWith(
        `${API_ENDPOINTS.CREDENTIALS}?${searchParams}`
      );
      expect(response).toStrictEqual(mockQueryResponse);
    });

    it('should remove the query param if nullish value', async () => {
      mockAxiosGetRequest.mockImplementationOnce(async () => ({
        data: mockQueryResponse,
      }));

      const response = await getVerifiableCredentials('', mockQueryOptions);

      const searchParams = new URLSearchParams({
        limit: mockQueryOptions.pagination.limit,
        sort: mockQueryOptions.sort,
      }).toString();

      expect(mockAxiosGetRequest).toHaveBeenCalledWith(
        `${API_ENDPOINTS.CREDENTIALS}?${searchParams}`
      );
      expect(response).toStrictEqual(mockQueryResponse);
    });

    it('should send cursors if not a nullish value', async () => {
      mockAxiosGetRequest.mockImplementationOnce(async () => ({
        data: mockQueryResponse,
      }));

      const response = await getVerifiableCredentials('query', {
        ...mockQueryOptions,
        pagination: {
          ...mockQueryOptions.pagination,
          nextCursor: 'nextCursor',
          prevCursor: 'prevCursor',
        },
      });

      const searchParams = new URLSearchParams({
        q: encodeURIComponent('query'),
        nextCursor: 'nextCursor',
        prevCursor: 'prevCursor',
        limit: mockQueryOptions.pagination.limit,
        sort: mockQueryOptions.sort,
      }).toString();

      expect(mockAxiosGetRequest).toHaveBeenCalledWith(
        `${API_ENDPOINTS.CREDENTIALS}?${searchParams}`
      );
      expect(response).toStrictEqual(mockQueryResponse);
    });

    it('should throw error if error occurs', async () => {
      mockAxiosGetRequest.mockRejectedValueOnce(new Error());

      await expect(
        getVerifiableCredentials('query', mockQueryOptions)
      ).rejects.toThrow();
    });
  });
});
