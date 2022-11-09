import {
  VerifiableCredential, VerificationResult, VerifierFunction, VerifyOptions
} from '@dvp/api-interfaces';
import { verify as oAVerify } from './openAttestation';

export class VerifyService {
  //Choose which backend to use based on the given VC.
  getVerifier(
    verifiableCredential: VerifiableCredential,
    _options: VerifyOptions
  ) {
    if (verifiableCredential.type.includes('OpenAttestationCredential')) {
      console.log('Found an OpenAttestationCredential');
      return oAVerify;
    } else {
      console.log('Unknown credential type found');
      throw Error('Non OpenAttestation credentials are not handled currently');
    }
  }

  /**
   * TODO: We need a consistent approach for handling communicating error from the VC-API
   * We could revisit this after investigating error handling in other VC-API implementations, e.g. didkit
   */
  async verify(
    verifiableCredential: VerifiableCredential,
    options: VerifyOptions
  ): Promise<VerificationResult> {
    let verifier: VerifierFunction;
    try {
      verifier = this.getVerifier(verifiableCredential, options);
    } catch (err) {
      return {
        errors: [`Unsupported credential type`],
        warnings: [],
        checks: [],
      };
    }
    try {
      return await verifier(verifiableCredential, options);
    } catch (err: unknown) {
      return {
        errors: ['Unknown exception in verify'],
        warnings: [],
        checks: [],
      };
    }
  }
}
