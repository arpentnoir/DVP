import { AuthorizationError } from '@dvp/server-common';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { authMiddleware } from './index';

const mockHeader = jest.fn();
const requestMock = getMockReq({
  header: mockHeader,
});
const { res: responseMock, next: nextMock, mockClear } = getMockRes();

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClear();
  });

  it('should call the next function if access token exists and has the required properties', () => {
    mockHeader.mockReturnValueOnce(
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'
    );

    const req = {
      ...requestMock,
      invocationContext: { userId: 'test-user-id', userAbn: 'test-user-abn' },
    } as typeof requestMock;

    authMiddleware(req, responseMock, nextMock);

    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock).toBeCalledWith();
  });

  it('should return error if request is missing auth header', () => {
    const req = {
      ...requestMock,
    } as typeof requestMock;
    authMiddleware(req, responseMock, nextMock);

    expect(nextMock).toBeCalledWith(
      new AuthorizationError(req.path, '', 'Authorization header', undefined)
    );
  });

  it('should return error if auth header does not start with Bearer', () => {
    mockHeader.mockReturnValueOnce('badHeader');

    const req = {
      ...requestMock,
    } as typeof requestMock;

    authMiddleware(req, responseMock, nextMock);

    expect(nextMock).toBeCalledWith(
      new AuthorizationError(req.path, '', 'Authorization header', 'badHeader')
    );
  });

  it('should return error if auth header does not contain accessToken', () => {
    mockHeader.mockReturnValueOnce('Bearer ');

    const req = {
      ...requestMock,
    } as typeof requestMock;

    authMiddleware(req, responseMock, nextMock);

    expect(nextMock).toBeCalledWith(
      new AuthorizationError(req.path, '', 'Access token', '')
    );
  });

  it('should return error if the userId property is null', () => {
    mockHeader.mockReturnValueOnce(
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U'
    );

    const req = {
      ...requestMock,
      invocationContext: { userId: null, userAbn: 'test-user-abn' },
    } as typeof requestMock;

    authMiddleware(req, responseMock, nextMock);

    expect(nextMock).toBeCalledWith(
      new AuthorizationError(
        req.path,
        '',
        'Authorization',
        'Invalid access token'
      )
    );
  });

  it('should return error if the userAbn property is null', () => {
    mockHeader.mockReturnValueOnce(
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'
    );

    const req = {
      ...requestMock,
      invocationContext: { userId: '1234567890', userAbn: null },
    } as typeof requestMock;

    authMiddleware(req, responseMock, nextMock);

    expect(nextMock).toBeCalledWith(
      new AuthorizationError(
        req.path,
        '',
        'Authorization',
        'Invalid access token'
      )
    );
  });
});
