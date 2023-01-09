import { IssueCredentialRequestSigningMethodEnum } from '@dvp/api-client';
import { VerifiableCredential } from '@dvp/api-interfaces';
import { RequestInvocationContext } from '@dvp/server-common';
import { getMockReq } from '@jest-mock/express';
import unsignedSvip from '../../fixtures/genericvc/degree_unsigned.json';
import unsignedOAV3 from '../../fixtures/oav3/did.json';

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
    unsigned_OA_V3_base = JSON.parse(JSON.stringify(unsignedOAV3));
  });

  it('should issue a valid OA credential', async () => {
    const issueService = new IssueService(invocationContext);
    const issuedCredential = await issueService.issue(
      IssueCredentialRequestSigningMethodEnum.Oa,
      unsignedOAV3 as never
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
      expect.objectContaining(unsignedOAV3.credentialSubject)
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
      issueService.issue(
        IssueCredentialRequestSigningMethodEnum.Oa,
        unsigned_no_context_OA_V3
      )
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
        issueService.issue(
          IssueCredentialRequestSigningMethodEnum.Oa,
          unsigned_no_openAttestationMetadata_OA_V3
        )
      ).rejects.toThrow('Failed to issue verifiable credential');
    });
  });

  describe('SVIP', () => {
    jest.setTimeout(20000);
    it('should fail if credential fails to validate', async () => {
      const unsigned_non_OA_V3 = unsigned_OA_V3_base;
      unsigned_non_OA_V3['type'] = ['VerifiableCredential'];

      const issueService = new IssueService(invocationContext);
      await expect(() =>
        issueService.issue(
          IssueCredentialRequestSigningMethodEnum.Svip,
          unsigned_non_OA_V3
        )
      ).rejects.toThrow('credential is not valid JSON-LD');
    });

    it('should issue a valid OA credential', async () => {
      const issueService = new IssueService(invocationContext);
      const issuedCredential = await issueService.issue(
        IssueCredentialRequestSigningMethodEnum.Svip,
        unsignedSvip as VerifiableCredential
      );

      expect(issuedCredential.proof).toEqual(
        expect.objectContaining({
          type: 'Ed25519Signature2018',
          proofPurpose: 'assertionMethod',
        })
      );

      expect(issuedCredential.credentialSubject).toEqual(
        expect.objectContaining(unsignedSvip.credentialSubject)
      );
      expect(issuedCredential.proof).toHaveProperty('verificationMethod');
      expect(issuedCredential.proof).toHaveProperty('created');
      expect(issuedCredential.proof).toHaveProperty('jws');
    });
  });
});
