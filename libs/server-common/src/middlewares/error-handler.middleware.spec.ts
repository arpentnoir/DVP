import { getMockReq, getMockRes } from '@jest-mock/express';
import { NotFoundError, SystemError } from '../error';
import { errorHandler } from './index';
const requestMock = getMockReq();

const { res: responseMock, next: nextMock, mockClear } = getMockRes();

describe('ErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClear();
  });
  it('should send response to client if error is instance of CustomError', () => {
    const notFoundError = new NotFoundError(
      '3a33cd7e-13e3-423f-a96e-36793a448b4c'
    );
    errorHandler(notFoundError, requestMock, responseMock, nextMock);
    expect(responseMock.send).toBeCalledWith(notFoundError.toApiError());
  });

  it('should send response to client if error is instance of ServerError', () => {
    const systemError = new SystemError(new Error('Server Error'));
    errorHandler(systemError, requestMock, responseMock, nextMock);
    expect(responseMock.send).toBeCalledWith(systemError.toApiError());
  });

  it('should send 500 response to client with generic message if unknown error', () => {
    const err = new Error();
    errorHandler(err, requestMock, responseMock, nextMock);
    expect(responseMock.send).toBeCalledWith(new SystemError(err).toApiError());
  });
});
