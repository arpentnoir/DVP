// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import MockExpressRequest from 'mock-express-request';
import { RequestInvocationContext } from './request.invocation.context';

describe('Request invocation context implementation', (): void => {
  it('should extract the correlation ID from the request', (): void => {
    const mockRequest = new MockExpressRequest({
      method: 'GET',
      headers: {
        'Correlation-ID': 'NUMPTYHEAD1',
      },
    });

    mockRequest.route = { path: '/log' };
    const invocationContext = new RequestInvocationContext(mockRequest);
    expect(invocationContext.correlationId).toBeDefined();
    expect(invocationContext.correlationId).toBe('NUMPTYHEAD1');
  });

  it('should create one if the correlation ID cannot be extracted from the request', (): void => {
    const mockRequest = new MockExpressRequest({
      method: 'GET',
      headers: {},
    });

    mockRequest.route = { path: '/log' };
    const invocationContext = new RequestInvocationContext(mockRequest);
    expect(invocationContext.correlationId).not.toBeUndefined();
  });

  it('should extract the remote IP address correctly', (): void => {
    const mockRequest = new MockExpressRequest({
      method: 'POST',
      headers: {
        'X-Forwarded-For': '10.10.10.1,20.20.20.1,30.30.30.1',
      },
      body: {
        key1: 'value1',
        key2: 'value2',
      },
      socket: {
        remoteAddress: '5.5.5.109',
      },
    });

    mockRequest.route = { path: '/log' };
    const invocationContext1 = new RequestInvocationContext(mockRequest);
    expect(invocationContext1.ipAddress).toBe('10.10.10.1');

    mockRequest.headers['x-forwarded-for'] = '8.8.8.23';

    const invocationContext2 = new RequestInvocationContext(mockRequest);
    expect(invocationContext2.ipAddress).toBe('8.8.8.23');

    mockRequest.headers['x-forwarded-for'] = undefined;

    const invocationContext3 = new RequestInvocationContext(mockRequest);
    expect(invocationContext3.ipAddress).toBe('5.5.5.109');
  });

  it('should extract the correlation ID correctly', (): void => {
    const mockRequest = new MockExpressRequest({
      method: 'PUT',
      headers: {
        'Correlation-ID': 'abc123',
      },
      body: {
        key1: 'value1',
        key2: 55,
      },
    });

    mockRequest.route = { path: '/log' };
    const invocationContext1 = new RequestInvocationContext(mockRequest);
    expect(invocationContext1.correlationId).toBe('abc123');

    mockRequest.headers['correlation-id'] = undefined;
    const invocationContext2 = new RequestInvocationContext(mockRequest);
    expect(invocationContext2.correlationId).toBeDefined();
  });
});
