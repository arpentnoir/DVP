import { IssueCredentialRequestSigningMethodEnum } from '@dvp/api-client';
import { setRevocationStatus } from './status.service';

describe('setRevocationStatus', () => {
  describe('SVIP', () => {
    it('should successfully revoke a valid VC', async () => {
      await expect(
        setRevocationStatus({
          credentialId: 'mock-success-credential-id',
          revoke: true,
          signingMethod: IssueCredentialRequestSigningMethodEnum.Svip,
        })
      ).resolves.toBeUndefined();
    });

    it('should successfully unrevoke a valid VC', async () => {
      await expect(
        setRevocationStatus({
          credentialId: 'mock-success-credential-id',
          revoke: false,
          signingMethod: IssueCredentialRequestSigningMethodEnum.Svip,
        })
      ).resolves.toBeUndefined();
    });

    it('should throw error if resource is not found', async () => {
      await expect(
        setRevocationStatus({
          credentialId: 'mock-error-credential-id',
          revoke: true,
          signingMethod: IssueCredentialRequestSigningMethodEnum.Svip,
        })
      ).rejects.toThrow('Failed to set revocation status');
    });
  });

  describe('OA', () => {
    it('should successfully revoke a valid VC', async () => {
      await expect(
        setRevocationStatus({
          credentialId: 'mock-success-credential-id',
          revoke: true,
          signingMethod: IssueCredentialRequestSigningMethodEnum.Oa,
        })
      ).resolves.toBeUndefined();
    });

    it('should successfully unrevoke a valid VC', async () => {
      await expect(
        setRevocationStatus({
          credentialId: 'mock-success-credential-id',
          revoke: false,
          signingMethod: IssueCredentialRequestSigningMethodEnum.Oa,
        })
      ).resolves.toBeUndefined();
    });

    it('should throw error if resource is not found', async () => {
      await expect(
        setRevocationStatus({
          credentialId: 'mock-error-credential-id',
          revoke: true,
          signingMethod: IssueCredentialRequestSigningMethodEnum.Oa,
        })
      ).rejects.toThrow('Failed to set revocation status');
    });
  });
});
