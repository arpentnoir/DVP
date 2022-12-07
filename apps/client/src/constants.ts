export const APP_NAME = 'Digital Verification Platform';
export const SHORT_APP_NAME = 'DVP';
export const LOGO_ALT_TEXT = 'Australian Border Force Logo';

export const ROUTES = {
  HOME: '/',
  VERIFY: '/verify',
  VIEWER: '/viewer',
};

export const FAIL_VC_FETCH_DECRYPT_ERR_MSG =
  'Unable to fetch and/or decrypt Verifiable Credential';

  export const FAIL_CREATE_VC =
  'Unable to create Verifiable Credential';
export const API_ENDPOINTS = { VERIFY: '/verify', ISSUE: '/issue' };

export const GENERIC_COO_META_DATA = {
  type: ['VerifiableCredential', 'OpenAttestationCredential'],
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://dev-dvp-context.s3.ap-southeast-2.amazonaws.com/AANZFTA-CoO.json',
    'https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json',
  ],
  openAttestationMetadata: {
    template: {
      type: 'EMBEDDED_RENDERER',
      name: 'AANZFTACoO',
      url: 'https://dev.renderer.dvp.ha.showthething.com',
    },
    proof: {
      type: 'OpenAttestationProofMethod',
      method: 'DID',
      value: 'did:ethr:0x4Bf4190a27A37d1677c8ADE25b53F1e22885531f',
      revocation: {
        type: 'NONE',
      },
    },
    identityProof: {
      type: 'DNS-DID',
      identifier: 'dvp.ha.showthething.com',
    },
  },
  issuer: {
    id: 'did:ethr:0x4Bf4190a27A37d1677c8ADE25b53F1e22885531f',
    name: 'GoSource Pty Ltd',
    type: 'OpenAttestationIssuer',
  },
};
