import { OAVerifiableCredential, VerifiableCredential } from './vc';

export type IssuerFunction = (
  credential: VerifiableCredential | OAVerifiableCredential,
  verificationMethod: string,
  signingKey: string
) => Promise<VerifiableCredential>;
