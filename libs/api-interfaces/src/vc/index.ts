import {
  OpenAttestationDocument,
  WrappedDocument,
} from '@govtechsg/open-attestation/dist/types/3.0/types';

export interface Message {
  message: string;
}

export interface CredentialSubject {
  [string: string]: any;
  links?: {
    self?: {
      href: string;
    };
  };
}

export interface Issuer {
  id: string;
  name: string;
  type: string;
}

//TODO: extend as needed
export interface VerifiableCredential extends OpenAttestationDocument {
  credentialSubject: CredentialSubject;
}

export type WrappedVerifiableCredential = WrappedDocument<VerifiableCredential>;
