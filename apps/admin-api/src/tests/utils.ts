import { getMockReq } from '@jest-mock/express';

export const authTokenWithSubAndAbn =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiYWJuIjoiMDAwMDAwMDAwMDAifQ.mYt_zdD9hjCC0267io5tyeTx0r6Xrh4B6JRVLqHkY5A';
export const authTokenWithoutAbn =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
export const authTokenWithoutSub =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhYm4iOiI0MTE2MTA4MDE0NiJ9.xH8xNWpezPBknplKCi_xt7xFipXpcYkY3Sv0ID1PQzk';

export const getMockRequest = (
  path: string,
  method: string,
  payload?: any,
  query?: Record<string, any>,
  params?: Record<string, any>
) =>
  getMockReq({
    method,
    query,
    params,
    headers: {
      'Correlation-ID': 'NUMPTYHEAD1',
    },
    ...(payload ? { body: payload } : {}),
    header: jest.fn().mockImplementation(() => authTokenWithSubAndAbn),
    route: { path },
  });
