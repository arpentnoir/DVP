import { getDocument } from './storage.service';

const mockGetDocument = jest.fn();

const mockStorageClient = {
  getDocument: mockGetDocument,
};

describe('Get Document Service', () => {
  it('should call storageClient.getDocument method', async () => {
    await getDocument(mockStorageClient, 'valid_uuid');
    expect(mockGetDocument).toHaveBeenCalledTimes(1);
    expect(mockGetDocument).toHaveBeenCalledWith('valid_uuid');
  });
});
