import { OpenAttestationDocument } from '@govtechsg/open-attestation/dist/types/3.0/types';

export interface Message {
  message: string;
}

export interface CredentialSubject {
  [string: string]: any;
}

export interface Issuer {
  id: string;
  name: string;
  type: string;
}

//TODO: extend as needed
export type VerifiableCredential = OpenAttestationDocument;
