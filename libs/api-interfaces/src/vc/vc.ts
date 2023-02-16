import {
  CredentialStatus,
  OpenAttestationDocument,
  OpenAttestationMetadata,
  WrappedDocument,
} from '@govtechsg/open-attestation/dist/types/3.0/types';

import { VerifiableCredential as ApiVerifiableCredential } from '@dvp/api-client';

export interface Message {
  message: string;
}

export interface DocumentMetadata {
  documentNumber?: string;
  freeTradeAgreement?: string;
  importingJurisdiction?: string;
  exporterOrManufacturerAbn?: string;
  importerName?: string;
  consignmentReferenceNumber?: string;
  documentDeclaration?: boolean;
  issueDate?: string;
  expiryDate?: string;
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
export interface VerifiableCredential extends ApiVerifiableCredential {
  credentialSubject: CredentialSubject;
  credentialStatus?: CredentialStatus;
  openAttestationMetadata?: OpenAttestationMetadata;
}

export interface OAVerifiableCredential
  extends Omit<OpenAttestationDocument, 'credentialSubject'> {
  credentialSubject: CredentialSubject;
}

export type WrappedVerifiableCredential =
  WrappedDocument<OAVerifiableCredential>;
