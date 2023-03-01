import { KMSClient } from '@aws-sdk/client-kms';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { decrypt, encrypt } from './kms';

const mockKmsClient = mockClient(KMSClient as never);
describe('kms', () => {
  beforeEach(() => {
    mockKmsClient.reset();
  });
  describe('encrypt', () => {
    it('should encrypt and return CiphertextBlob', async () => {
      const encryptedData = Buffer.from('encrypted text');
      mockKmsClient.resolvesOnce({
        CiphertextBlob: encryptedData,
      } as never);
      const res = await encrypt({
        data: Buffer.from('testing'),
        encryptionContext: { abn: 'abn' },
        keyId: '12345',
        kMSClientConfig: {},
      });
      expect(res).toEqual(encryptedData);
    });
  });

  describe('decrypt', () => {
    it('should decrypt the encrypted test using kms', async () => {
      const encryptedData = Buffer.from('encrypted text');
      mockKmsClient.resolvesOnce({
        Plaintext: Buffer.from('Plain text'),
      } as never);
      const res = await decrypt({
        encryptedData,
        encryptionContext: { abn: 'abn' },
        keyId: '12345',
        kMSClientConfig: {},
      });
      expect(res).toEqual('Plain text');
    });
  });
});
