import { VerifiableCredential } from '@dvp/api-interfaces';
import { getMockInvocationContext, getUuId } from '@dvp/server-common';
import { generateEncryptionKey } from '@govtechsg/oa-encryption';
import { StorageService } from './storage.service';
import didSignedDocument from '../../fixtures/oav3/did-signed.json';
import oa_doc from '../../fixtures/oav3/did.json';

const mockGetDocument = jest.fn();
const mockUploadDocument = jest.fn();
const mockDeleteDocument = jest.fn();

const mockStorageClient = {
  getDocumentStorePath: jest.fn(() => 'documents/'),
  getDocument: mockGetDocument,
  uploadDocument: mockUploadDocument,
  isDocumentExists: jest.fn(),
  deleteDocument: mockDeleteDocument,
};

describe('Storage Service', () => {
  afterEach(() => {
    mockUploadDocument.mockRestore();
    mockGetDocument.mockRestore();
    mockDeleteDocument.mockRestore();
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

    it('should create encryption key and document Id if not supplied', async () => {
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

  describe('deleteDocument', () => {
    it('should call storageClient.deleteDocument method', async () => {
      mockDeleteDocument.mockResolvedValueOnce({});
      const storageService = new StorageService(invocationContext);

      await storageService.deleteDocument(mockStorageClient, 'valid_uuid');
      expect(mockDeleteDocument).toHaveBeenCalledTimes(1);
      expect(mockDeleteDocument).toHaveBeenCalledWith('valid_uuid');
    });
  });

  describe('generateQrUrl', () => {
    describe('create a QrUrl to be embedded inside VC', () => {
      it('should create encryption key and document Id if not supplied', () => {
        const storageService = new StorageService(invocationContext);

        const qrUrlPayload = storageService.generateQrUrl();
        const { qrUrl: returnedQrUrl, id, key } = qrUrlPayload;

        expect(id).toBeDefined();
        expect(key).toBeDefined();

        const qrUrl = `client/verify?q=${encodeURIComponent(
          JSON.stringify({
            payload: { uri: `api/storage/documents/${id}`, key },
          })
        )}`;

        expect(returnedQrUrl).toStrictEqual(qrUrl);
      });

      it('should use encryption key and document Id if supplied', () => {
        const id = 'id123';
        const key = 'key456';

        const storageService = new StorageService(invocationContext);

        const qrUrlPayload = storageService.generateQrUrl(id, key);

        const qrUrl = `client/verify?q=${encodeURIComponent(
          JSON.stringify({
            payload: { uri: `api/storage/documents/${id}`, key },
          })
        )}`;

        expect(qrUrlPayload).toStrictEqual({
          id,
          key,
          qrUrl,
        });
      });
    });
  });

  describe('embedQrUrl', () => {
    it('should embed QrUrl in verifiable credential', () => {
      const storageService = new StorageService(invocationContext);

      const vc = oa_doc as VerifiableCredential;

      expect(vc.credentialSubject.links).not.toBeDefined();

      const { credentialWithQrUrl } = storageService.embedQrUrl(vc);

      expect(credentialWithQrUrl).toMatchObject(vc);
      expect(credentialWithQrUrl.credentialSubject.links).toBeDefined();
    });
  });
});
