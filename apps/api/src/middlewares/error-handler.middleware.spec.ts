/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('uuid', () => ({
  v4: () => '3a33cd7e-13e3-423f-a96e-36793a448b4c',
}));
import { NotFoundError, SystemError } from '@dvp/server-common';
import { errorHandler } from './index';

const requestMock = jest.fn() as any;
const nextMock = jest.fn() as any;
const sendMock = jest.fn() as any;

const statusMock = jest.fn(() => ({ send: sendMock }));
const responseMock = { status: statusMock } as any;

describe('ErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should send response to client if error is instance of CustomError', () => {
    const notFoundError = new NotFoundError(
      '3a33cd7e-13e3-423f-a96e-36793a448b4c'
    );
    errorHandler(notFoundError, requestMock, responseMock, nextMock);
    expect(statusMock).toBeCalledWith(404);
    expect(sendMock).toBeCalledWith(notFoundError.toApiError());
  });

  it('should send response to client if error is instance of ServerError', () => {
    const systemError = new SystemError(new Error('Server Error'));
    errorHandler(systemError, requestMock, responseMock, nextMock);
    expect(statusMock).toBeCalledWith(500);
    expect(sendMock).toBeCalledWith(systemError.toApiError());
  });

  it('should send 500 response to client with generic message if unknown error', () => {
    const err = new Error();
    errorHandler(err, requestMock, responseMock, nextMock);
    expect(statusMock).toBeCalledWith(500);
    expect(sendMock).toBeCalledWith(new SystemError(err).toApiError());
  });
});
