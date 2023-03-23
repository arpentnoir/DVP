import {
  VerifiableCredential,
  VerificationResult,
  VerifierFunction,
} from '@dvp/api-interfaces';
import {
  ApplicationError,
  BadRequestError,
  Logger,
  openAttestation,
  RequestInvocationContext,
  transmute,
  ValidationError,
} from '@dvp/server-common';

/**
 * Service class that handles operations for verifying Verifiable Credentials.
 */
export class VerifyService {
  logger: Logger;
  invocationContext: RequestInvocationContext;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
  }

  /**
   * Chooses which external library to use for verifying the given Verifiable Credential. 
   * Gracefully handles the case where no suitable VC library can be found.
   * 
   * @param verifiableCredential The credential used to determine the verification method.
   * @returns A function from either the transmute or openAttestation libraries that
   * can be invoked to verify a VC.
   */
  getVerifier(verifiableCredential: VerifiableCredential): VerifierFunction {
    if (verifiableCredential.type.includes('OpenAttestationCredential')) {
      return openAttestation.verifyCredential as VerifierFunction;
    } else if (verifiableCredential.type.includes('VerifiableCredential')) {
      return transmute.verifyCredential as never;
    } else {
      this.logger.debug(
        '[VerifyService.getVerifier] Unknown credential type found, %s',
        verifiableCredential.type
      );
      const types = Array.isArray(verifiableCredential.type)
        ? verifiableCredential.type.join(',')
        : verifiableCredential.type;
      throw new ValidationError('type', types);
    }
  }

  /**
   * TODO: We need a consistent approach for handling communicating error from the VC-API
   * We could revisit this after investigating error handling in other VC-API implementations, e.g. didkit
   */
  /**
   * Verify a Verifiable Credential by invoking an exteranl VC verification library.
   * The library (and verify function therein) is returned by the call to getVerifier().
   * 
   * @param verifiableCredential The Verifiable Credential to be verified.
   * @returns A promise to return a @see {VerificationResult}.
   * 
   */
  async verify(
    verifiableCredential: VerifiableCredential
  ): Promise<VerificationResult> {
    let verifier: VerifierFunction;
    try {
      verifier = this.getVerifier(verifiableCredential);
    } catch (err) {
      this.logger.debug(
        '[VerifyService.verify] Unsupported credential type, %o',
        err
      );

      throw new BadRequestError(new Error('Unsupported credential type'));
    }
    try {
      return await verifier(verifiableCredential);
    } catch (err: unknown) {
      this.logger.debug(
        '[VerifyService.verify] Unknown exception during verification, %o',
        err
      );
      throw new ApplicationError('Unknown exception in verify');
    }
  }
}
