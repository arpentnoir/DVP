import valid_simple_vc from '../../fixtures/genericvc/degree_unsigned.json';
import signed_OA_V3 from '../../fixtures/oav3/did-signed.json';
import unsigned_OA_V3 from '../../fixtures/oav3/did.json';
import { VerifyService } from './verify.service';

describe('verify.service', () => {
  jest.setTimeout(15000);
  it('Should verify a valid OA credential', async () => {
    const verifyService = new VerifyService();
    const verificationResult = await verifyService.verify(signed_OA_V3, {});
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toHaveLength(0);
  });
  //TODO: add non-OA backend
  it.skip('Should verify a valid non-OA credential', async () => {
    const verifyService = new VerifyService();
    const verificationResult = await verifyService.verify(valid_simple_vc, {});
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toHaveLength(0);
  });
  it('Should fail DOCUMENT_INTEGRITY when tampered', async () => {
    const tampered_OA_V3 = { ...signed_OA_V3 };
    tampered_OA_V3.credentialSubject['thisFieldWasAltered'] = 'Yes';
    const verifyService = new VerifyService();
    const verificationResult = await verifyService.verify(tampered_OA_V3, {});
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toContain('proof');
  });
  it("Should fail DOCUMENT_STATUS when it's unsigned and unwrapped", async () => {
    const verifyService = new VerifyService();
    const verificationResult = await verifyService.verify(unsigned_OA_V3, {});
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toContain('status');
    expect(verificationResult.errors).toContain('proof');
  });
});
