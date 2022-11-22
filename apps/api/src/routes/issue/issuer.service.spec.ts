import { VerifiableCredential } from '@dvp/api-interfaces';
import { RequestInvocationContext } from '@dvp/server-common';
import { getMockReq } from '@jest-mock/express';
import unsigned_OA_V3 from '../../fixtures/oav3/did.json';
import { IssueService } from './issue.service';

let unsigned_OA_V3_base: VerifiableCredential;

describe('issue.service', () => {
  const mockRequest = getMockReq({
    method: 'POST',
    headers: {
      'Correlation-ID': 'NUMPTYHEAD1',
    },
  });

  mockRequest.route = { path: '/issue' };
  const invocationContext = new RequestInvocationContext(mockRequest);

  beforeEach(() => {
    unsigned_OA_V3_base = JSON.parse(JSON.stringify(unsigned_OA_V3));
  });

  it('should issue a valid OA credential', async () => {
    const issueService = new IssueService(invocationContext);
    const issuedCredential = await issueService.issue(
      unsigned_OA_V3 as VerifiableCredential
    );

    expect(issuedCredential.proof).toEqual(
      expect.objectContaining({
        type: 'OpenAttestationMerkleProofSignature2018',
        proofPurpose: 'assertionMethod',
        proofs: [],
        privacy: { obfuscated: [] },
      })
    );

    expect(issuedCredential.credentialSubject).toEqual(
      expect.objectContaining(unsigned_OA_V3.credentialSubject)
    );
    expect(issuedCredential.proof).toHaveProperty('targetHash');
    expect(issuedCredential.proof).toHaveProperty('merkleRoot');
    expect(issuedCredential.proof).toHaveProperty('salts');
    expect(issuedCredential.proof).toHaveProperty('key');
    expect(issuedCredential.proof).toHaveProperty('signature');
  });

  it('should fail if property was not defined in the context', async () => {
    const unsigned_no_context_OA_V3 = unsigned_OA_V3_base;
    unsigned_no_context_OA_V3['@context'] = [
      'https://www.w3.org/2018/credentials/v1',
    ];

    const issueService = new IssueService(invocationContext);
    await expect(() =>
      issueService.issue(unsigned_no_context_OA_V3)
    ).rejects.toThrow('Failed to issue verifiable credential');
  });
  describe('OpenAttestation', () => {
    it('should fail if openAttestationMetadata is missing', async () => {
      const unsigned_no_openAttestationMetadata_OA_V3 = unsigned_OA_V3_base;
      delete unsigned_no_openAttestationMetadata_OA_V3[
        'openAttestationMetadata'
      ];

      const issueService = new IssueService(invocationContext);
      await expect(() =>
        issueService.issue(unsigned_no_openAttestationMetadata_OA_V3)
      ).rejects.toThrow('Failed to issue verifiable credential');
    });
  });

  describe('Non-OpenAttestation', () => {
    it('should fail if non-openAttestation document is used', async () => {
      const unsigned_non_OA_V3 = unsigned_OA_V3_base;
      unsigned_non_OA_V3['type'] = ['VerifiableCredential'];

      const issueService = new IssueService(invocationContext);
      await expect(() =>
        issueService.issue(unsigned_non_OA_V3)
      ).rejects.toThrow('Failed to issue verifiable credential');
    });
  });
});
