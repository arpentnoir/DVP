import { VerifiableCredential } from "../vc";

export interface VerificationResult{
  checks: string[];
  warnings: string[];
  errors: string[];
}

//TODO: fill out verify options as we support them
export interface VerifyOptions{
  [key:string] : any;
}

export type VerifierFunction = (vc: VerifiableCredential, options?:VerifyOptions) =>
  Promise<VerificationResult>;
