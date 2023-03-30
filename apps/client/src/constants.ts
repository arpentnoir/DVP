import { getVcContextAndRendererEndpoints } from './config';

export const { contextUrl, rendererUrl } = getVcContextAndRendererEndpoints();

export const APP_NAME = 'Digital Verification Platform';
export const SHORT_APP_NAME = 'DVP';
export const LOGO_ALT_TEXT = 'Australian Border Force Logo';
export const FOOTER_LOGO_ALT_TEXT = 'Australian Government';

export const DEFAULT_TABLE_LIMIT = 50;

export const FAIL_FETCH_DOCUMENTS_ERR_MSG = 'Unable to fetch documents';
export const FAIL_CREATE_VC = 'Unable to create Verifiable Credential';

export const DEFAULT_API_QUERY_ERROR_MESSAGE =
  'An error occurred while fetching the data';
export const FAIL_VC_FETCH_DECRYPT_ERR_MSG =
  'Unable to fetch and/or decrypt Verifiable Credential';

export const REVOCATION_FAILED_MESSAGE = 'Failed to set revocation status';

export enum RevocationStatus {
  'IN_PROGRESS' = 'IN PROGRESS',
  'ACTIVE' = 'ACTIVE',
  'REVOKED' = 'REVOKED',
}

export enum RevocationAction {
  REVOKE = 'Revoke',
  UNREVOKE = 'Unrevoke',
}

export const ROUTES = {
  HOME: '/',
  VERIFY: '/verify',
  VIEWER: '/viewer',
  ISSUE: '/issue',
};

export const API_ENDPOINTS = {
  VERIFY: '/credentials/verify',
  ISSUE: '/credentials/issue',
  CREDENTIALS: '/credentials',
  REVOKE: '/credentials/status',
};

export const GENERIC_SVIP_META_DATA = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    `${contextUrl}/AANZFTA-CoO.json`,
    `${contextUrl}/AANZFTA-CoO-Context-Partial.json`,
    'https://w3id.org/vc-revocation-list-2020/v1',
  ],
  type: ['VerifiableCredential'],
  issuer: {
    id: 'did:ethr:0x4Bf4190a27A37d1677c8ADE25b53F1e22885531f#controller',
  },
};

export const GENERIC_OA_META_DATA = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    `${contextUrl}/AANZFTA-CoO.json`,
    `${contextUrl}/AANZFTA-CoO-Context-Partial.json`,
    'https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json',
  ],
  type: ['VerifiableCredential', 'OpenAttestationCredential'],
  issuer: {
    id: 'did:ethr:0x4Bf4190a27A37d1677c8ADE25b53F1e22885531f#controller',
    name: 'GoSource Pty Ltd',
    type: 'OpenAttestationIssuer',
  },
  openAttestationMetadata: {
    template: {
      type: 'EMBEDDED_RENDERER',
      name: 'AANZFTACoO',
      url: rendererUrl,
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
};
