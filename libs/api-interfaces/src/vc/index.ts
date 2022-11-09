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

// Temporarily declaring Document
// Add or remove as needed
export interface Document {
  version: string;
  credentialSubject: CredentialSubject;
  '@context': string[];
  issuer: Issuer;
}

//TODO: fill out this type
export interface VerifiableCredential{
  "@context": Array<{ [key: string]: any } | string>;
  issuer: string | Record<string, unknown>;
  credentialSubject: Record<string, unknown>;
  proof?: Record<string, unknown>;
  credentialStatus?: Record<string, unknown>;
  [key: string]: any;
}
