import { getMockInvocationContext } from '@dvp/server-common';
import { StorageService } from './storage.service';

const mockGetDocument = jest.fn();

const mockStorageClient = {
  getDocument: mockGetDocument,
};

describe('Get Document Service', () => {
  const invocationContext = getMockInvocationContext(
    'GET',
    '/storage/documents/valid_uuid'
  );

  it('should call storageClient.getDocument method', async () => {
    const storageService = new StorageService(invocationContext);

    await storageService.getDocument(mockStorageClient, 'valid_uuid');
    expect(mockGetDocument).toHaveBeenCalledTimes(1);
    expect(mockGetDocument).toHaveBeenCalledWith('valid_uuid');
  });
});
