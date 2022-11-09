/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('uuid', () => ({
  v4: () => '3a33cd7e-13e3-423f-a96e-36793a448b4c',
}));
import { errorHandler } from './index';
import { CustomError, ServerError } from '../utils';

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
    errorHandler(
      new CustomError({ test: 'CustomError' } as any, 404),
      requestMock,
      responseMock,
      nextMock
    );
    expect(statusMock).toBeCalledWith(404);
    expect(sendMock).toBeCalledWith({
      errors: [
        { id: '3a33cd7e-13e3-423f-a96e-36793a448b4c', test: 'CustomError' },
      ],
    });
  });

  it('should send response to client if error is instance of ServerError', () => {
    errorHandler(
      new ServerError({ test: 'ServerError' } as any, 'Server Error!!!'),
      requestMock,
      responseMock,
      nextMock
    );
    expect(statusMock).toBeCalledWith(500);
    expect(sendMock).toBeCalledWith({
      errors: [
        { id: '3a33cd7e-13e3-423f-a96e-36793a448b4c', test: 'ServerError' },
      ],
    });
  });

  it('should send 500 response to client with generic message if unknown error', () => {
    errorHandler({}, requestMock, responseMock, nextMock);
    expect(statusMock).toBeCalledWith(500);
    expect(sendMock).toBeCalledWith({
      errors: [
        {
          id: '3a33cd7e-13e3-423f-a96e-36793a448b4c',
          code: 'DVPAPI-001',
          detail: 'System Unavailable.  Try again later.',
        },
      ],
    });
  });
});
