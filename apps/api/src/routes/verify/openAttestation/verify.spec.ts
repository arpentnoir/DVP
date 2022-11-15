import { VerifiableCredential } from '@dvp/api-interfaces';
import invalid_OA_V3 from '../../../fixtures/oav3/did-invalid-signed.json';
import signed_OA_V3 from '../../../fixtures/oav3/did-signed.json';
import unsigned_OA_V3 from '../../../fixtures/oav3/did.json';
import { verify } from './verify';

describe('Test OA verify', () => {
  jest.setTimeout(25000);
  it('Should verify a valid OA credential', async () => {
    const verificationResult = await verify(
      signed_OA_V3 as VerifiableCredential,
      {}
    );
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toHaveLength(0);
  });
  it('Should fail DOCUMENT_INTEGRITY when signature is invalid', async () => {
    const verificationResult = await verify(
      invalid_OA_V3 as VerifiableCredential,
      {}
    );
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toContain('proof');
  });
  it("Should fail DOCUMENT_STATUS when it's unsigned and unwrapped", async () => {
    const verificationResult = await verify(
      unsigned_OA_V3 as VerifiableCredential,
      {}
    );
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toContain('status');
    expect(verificationResult.errors).toContain('proof');
  });
});
