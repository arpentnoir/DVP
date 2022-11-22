import { SignedWrappedDocument } from '@govtechsg/open-attestation/dist/types/3.0/types';
import { VerifiableCredential } from '../vc';

// Extend as needed
export type IssueResult = SignedWrappedDocument;

export type IssuerFunction = (
  credential: VerifiableCredential,
  verificationMethod: string,
  signingKey: string
) => Promise<IssueResult>;
