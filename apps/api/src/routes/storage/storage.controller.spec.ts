import { NotFoundError } from '@dvp/server-common';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { getDocumentById } from './storage.controller';
import { StorageService } from './storage.service';

jest.mock('uuid', () => ({
  v4: () => '3a33cd7e-13e3-423f-a96e-36793a448b4c',
}));
jest.mock('./storage.service');

const { res: responseMock, next: mockNext } = getMockRes({ send: jest.fn() });

describe('Storage Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDocumentById', () => {
    it('should return a document if it exists', async () => {
      (StorageService.prototype.getDocument as jest.Mock).mockResolvedValueOnce(
        'testDocument'
      );
      const requestMock = getMockReq({
        params: { documentId: '3a33cd7e-13e3-423f-a96e-36793a448b4c' },
        originalUrl: '/storage/',
      });

      await getDocumentById(requestMock, responseMock, mockNext);

      expect(responseMock.json).toBeCalledWith({ document: 'testDocument' });
    });

    it("should send error to error handler if document doesn't exist", async () => {
      (StorageService.prototype.getDocument as jest.Mock).mockResolvedValueOnce(
        null
      );
      const documentId = '2a33cd7e-13e3-423f-a96e-36793a448b4b';

      const requestMock = getMockReq({
        params: { documentId },
        originalUrl: `/storage/${documentId}`,
      });
      await getDocumentById(requestMock, responseMock, mockNext);

      expect(mockNext).toBeCalledWith(
        new NotFoundError(`/storage/${documentId}`)
      );
    });

    it('should send serverError to error handler if something unexpected happens', async () => {
      (StorageService.prototype.getDocument as jest.Mock).mockRejectedValueOnce(
        new Error('testErrorMessage')
      );

      const requestMock = getMockReq({
        params: { documentId: '4a33cd7e-13e3-423f-a96e-36793a448b4a' },
        originalUrl: '/storage/',
      });

      await getDocumentById(requestMock, responseMock, mockNext);
      expect(mockNext).toBeCalledWith(new Error('testErrorMessage'));
    });
  });
});
