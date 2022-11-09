/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('uuid', () => ({
  v4: () => '3a33cd7e-13e3-423f-a96e-36793a448b4c',
}));
jest.mock('./storage.service');

import { getDocumentById } from './storage.controller';
import { getDocument } from './storage.service';
import { ServerError } from '../../utils';

const mockedGetDocument = getDocument as jest.Mock;
const ResponseMock = { send: jest.fn() } as any;
const mockNext = jest.fn() as any;

describe('Storage Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a document if it exists', async () => {
    mockedGetDocument.mockResolvedValueOnce({ document: 'testDocument' });
    await getDocumentById(
      {
        params: { documentId: '3a33cd7e-13e3-423f-a96e-36793a448b4c' },
        originalUrl: '/storage/',
      } as any,
      ResponseMock,
      mockNext
    );

    expect(ResponseMock.send).toBeCalledWith({ document: 'testDocument' });
  });

  it("should send error to error handler if document doesn't exist", async () => {
    mockedGetDocument.mockResolvedValueOnce(null);
    await getDocumentById(
      {
        params: { documentId: '2a33cd7e-13e3-423f-a96e-36793a448b4b' },
        originalUrl: '/storage/',
      } as any,
      ResponseMock,
      mockNext
    );

    expect(mockNext).toBeCalledWith({
      errorObject: {
        code: 'DVPAPI-002',
        detail: 'Cannot find resource `/storage/`',
        source: {
          location: 'ID',
          parameter: '2a33cd7e-13e3-423f-a96e-36793a448b4b',
        },
      },
      statusCode: 404,
    });
  });

  it('should send serverError to error handler if somthing unexpected happens', async () => {
    mockedGetDocument.mockRejectedValueOnce(new Error('testErrorMessage'));
    await getDocumentById(
      {
        params: { documentId: '4a33cd7e-13e3-423f-a96e-36793a448b4a' },
        originalUrl: '/storage/',
      } as any,
      ResponseMock,
      mockNext
    );
    expect(mockNext.mock.lastCall[0]).toBeInstanceOf(ServerError);
  });
});
