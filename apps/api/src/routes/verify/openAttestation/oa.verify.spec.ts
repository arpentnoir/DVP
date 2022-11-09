import { verify as OAVerify } from '.';
import invalid_OA_V3 from '../../../fixtures/oav3/did-invalid-signed.json';
import signed_OA_V3 from '../../../fixtures/oav3/did-signed.json';
import unsigned_OA_V3 from '../../../fixtures/oav3/did.json';

describe('Test OA verify', () => {
  jest.setTimeout(15000);
  it('Should verify a valid OA credential', async () => {
    const verificationResult = await OAVerify(signed_OA_V3, {});
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toHaveLength(0);
  });
  it('Should fail DOCUMENT_INTEGRITY when signature is invalid', async () => {
    const verificationResult = await OAVerify(invalid_OA_V3, {});
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toContain('proof');
  });
  it("Should fail DOCUMENT_STATUS when it's unsigned and unwrapped", async () => {
    const verificationResult = await OAVerify(unsigned_OA_V3, {});
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toContain('status');
    expect(verificationResult.errors).toContain('proof');
  });
});
