// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import MockExpressRequest from 'mock-express-request';
import { RequestInvocationContext } from '../context';

export const uuidV4Regex = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
);

export const getMockInvocationContext = (method: string, path: string) => {
  const mockRequest = new MockExpressRequest({
    method,
    headers: {
      'Correlation-ID': 'NUMPTYHEAD1',
    },
  });

  mockRequest.route = { path };
  return new RequestInvocationContext(mockRequest);
};
