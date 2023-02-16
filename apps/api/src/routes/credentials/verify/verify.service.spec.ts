import { VerifiableCredential } from '@dvp/api-interfaces';
import { RequestInvocationContext } from '@dvp/server-common';
import { getMockReq } from '@jest-mock/express';
import signedVC from '../../../fixtures/genericvc/degree_signed.json';

import signed_OA_V3 from '../../../fixtures/oav3/did-signed.json';
import unsigned_OA_V3 from '../../../fixtures/oav3/did.json';
import { VerifyService } from './verify.service';

describe('verify.service', () => {
  // TODO: Need to optimize. Currently taking too long.
  jest.setTimeout(20000);

  const mockRequest = getMockReq({
    method: 'POST',
    headers: {
      'Correlation-ID': 'NUMPTYHEAD1',
    },
  });

  mockRequest.route = { path: '/verify' };
  const invocationContext = new RequestInvocationContext(mockRequest);

  describe('open attestation', () => {
    it('should throw error for unsupported vc type', async () => {
      const tampered_OA_V3 = { ...signed_OA_V3 };
      tampered_OA_V3['type'] = ['Test'];
      const verifyService = new VerifyService(invocationContext);

      await expect(() =>
        verifyService.verify(tampered_OA_V3 as VerifiableCredential)
      ).rejects.toThrow('Unsupported credential type');
    });
    it('should verify a valid OA credential', async () => {
      const verifyService = new VerifyService(invocationContext);
      const verificationResult = await verifyService.verify(
        signed_OA_V3 as VerifiableCredential
      );
      expect(verificationResult).toHaveProperty('errors');
      expect(verificationResult.errors).toHaveLength(0);
    });
    it('should fail DOCUMENT_INTEGRITY when tampered', async () => {
      const tampered_OA_V3 = { ...signed_OA_V3 };
      tampered_OA_V3.credentialSubject['thisFieldWasAltered'] = 'Yes';
      const verifyService = new VerifyService(invocationContext);
      const verificationResult = await verifyService.verify(
        tampered_OA_V3 as VerifiableCredential
      );
      expect(verificationResult).toHaveProperty('errors');
      expect(verificationResult.errors).toContain('proof');
    });
    it("should fail DOCUMENT_STATUS when it's unsigned and unwrapped", async () => {
      const verifyService = new VerifyService(invocationContext);
      const verificationResult = await verifyService.verify(
        unsigned_OA_V3 as VerifiableCredential
      );
      expect(verificationResult).toHaveProperty('errors');
      expect(verificationResult.errors).toContain('status');
      expect(verificationResult.errors).toContain('proof');
    });
  });

  describe('transmute', () => {
    it('should verify a valid credential', async () => {
      const verifyService = new VerifyService(invocationContext);
      const verificationResult = await verifyService.verify(signedVC as never);
      expect(verificationResult.errors).toHaveLength(0);
    });
    it('should fail DOCUMENT_INTEGRITY when tampered', async () => {
      const tamperedVC = { ...signedVC };
      tamperedVC.credentialSubject['thisFieldWasAltered'] = 'Yes';
      const verifyService = new VerifyService(invocationContext);
      const verificationResult = await verifyService.verify(
        tamperedVC as never
      );
      expect(verificationResult).toHaveProperty('errors');
      expect(verificationResult.errors).toContain('proof');
    });

    it('should return inactive if vc is activation date is in the future', async () => {
      const tamperedVC = { ...signedVC };
      tamperedVC['issuanceDate'] = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString();
      const verifyService = new VerifyService(invocationContext);
      const verificationResult = await verifyService.verify(
        tamperedVC as never
      );
      expect(verificationResult).toHaveProperty('errors');
      expect(verificationResult.errors).toContain('proof');
      expect(verificationResult.errors).toContain('inactive');
    });

    it('should return expired if vc is expired', async () => {
      const tamperedVC = { ...signedVC };
      tamperedVC['expirationDate'] = new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      ).toISOString();
      const verifyService = new VerifyService(invocationContext);
      const verificationResult = await verifyService.verify(
        tamperedVC as never
      );
      expect(verificationResult).toHaveProperty('errors');
      expect(verificationResult.errors).toContain('proof');
      expect(verificationResult.errors).toContain('expired');
    });
  });
});
