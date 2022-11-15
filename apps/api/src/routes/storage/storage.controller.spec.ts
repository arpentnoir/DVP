import { NotFoundError, SystemError } from '@dvp/server-common';
import { getDocumentById } from './storage.controller';
import { StorageService } from './storage.service';

jest.mock('uuid', () => ({
  v4: () => '3a33cd7e-13e3-423f-a96e-36793a448b4c',
}));
jest.mock('./storage.service');

const ResponseMock = { send: jest.fn() } as any;
const mockNext = jest.fn() as any;

describe('Storage Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a document if it exists', async () => {
    (StorageService.prototype.getDocument as jest.Mock).mockResolvedValueOnce({
      document: 'testDocument',
    });
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
    (StorageService.prototype.getDocument as jest.Mock).mockResolvedValueOnce(
      null
    );
    const documentId = '2a33cd7e-13e3-423f-a96e-36793a448b4b';
    await getDocumentById(
      {
        params: { documentId },
        originalUrl: '/storage/',
      } as any,
      ResponseMock,
      mockNext
    );

    expect(mockNext).toBeCalledWith(
      new NotFoundError(`/storage//${documentId}`)
    );
  });

  it('should send serverError to error handler if somthing unexpected happens', async () => {
    (StorageService.prototype.getDocument as jest.Mock).mockRejectedValueOnce(
      new Error('testErrorMessage')
    );
    await getDocumentById(
      {
        params: { documentId: '4a33cd7e-13e3-423f-a96e-36793a448b4a' },
        originalUrl: '/storage/',
      } as any,
      ResponseMock,
      mockNext
    );
    expect(mockNext.mock.lastCall[0]).toBeInstanceOf(SystemError);
  });
});
