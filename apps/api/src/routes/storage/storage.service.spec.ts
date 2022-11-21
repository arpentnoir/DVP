import { getMockInvocationContext, getUuId } from '@dvp/server-common';
import { generateEncryptionKey } from '@govtechsg/oa-encryption';
import didSignedDocument from '../../fixtures/oav3/did-signed.json';
import { StorageService } from './storage.service';

const mockGetDocument = jest.fn();
const mockUploadDocument = jest.fn();

const mockStorageClient = {
  getDocument: mockGetDocument,
  uploadDocument: mockUploadDocument,
  isDocumentExists: jest.fn(),
};

describe('Storage Service', () => {
  afterEach(() => {
    mockUploadDocument.mockRestore();
    mockGetDocument.mockRestore();
  });
  const invocationContext = getMockInvocationContext(
    'GET',
    '/storage/documents/valid_uuid'
  );

  describe('getDocument', () => {
    it('should call storageClient.getDocument method', async () => {
      const storageService = new StorageService(invocationContext);

      await storageService.getDocument(mockStorageClient, 'valid_uuid');
      expect(mockGetDocument).toHaveBeenCalledTimes(1);
      expect(mockGetDocument).toHaveBeenCalledWith('valid_uuid');
    });
  });

  describe('uploadDocument', () => {
    it('should encrypt and upload the document', async () => {
      const storageService = new StorageService(invocationContext);
      const encryptionKey = generateEncryptionKey();
      const documentId = getUuId();
      mockUploadDocument.mockResolvedValueOnce(documentId);
      const res = await storageService.uploadDocument(
        mockStorageClient,
        JSON.stringify(didSignedDocument),
        documentId,
        encryptionKey
      );
      expect(mockUploadDocument).toHaveBeenCalledTimes(1);
      expect(res).toMatchObject({ documentId, encryptionKey });
    });

    it('should create encryption key and document if not supplied', async () => {
      const storageService = new StorageService(invocationContext);
      const documentId = getUuId();
      mockUploadDocument.mockResolvedValueOnce(documentId);
      const res = await storageService.uploadDocument(
        mockStorageClient,
        JSON.stringify(didSignedDocument)
      );
      expect(mockUploadDocument).toHaveBeenCalledTimes(1);
      expect(res.encryptionKey).toBeDefined();
      expect(res.documentId).toBeDefined();
    });
  });
});
