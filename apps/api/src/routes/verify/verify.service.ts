import {
  VerifiableCredential,
  VerificationResult,
  VerifierFunction,
} from '@dvp/api-interfaces';
import {
  ApplicationError,
  Logger,
  RequestInvocationContext,
  ValidationError,
} from '@dvp/server-common';
import { verify as oAVerify } from './openAttestation';
import { verifyCredential as transmuteVerify } from './transmute';

export class VerifyService {
  logger: Logger;
  invocationContext: RequestInvocationContext;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
  }

  //Choose which backend to use based on the given VC.
  getVerifier(verifiableCredential: VerifiableCredential): VerifierFunction {
    if (verifiableCredential.type.includes('OpenAttestationCredential')) {
      return oAVerify as VerifierFunction;
    } else if (verifiableCredential.type.includes('VerifiableCredential')) {
      return transmuteVerify as never;
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

      throw new ApplicationError('Unsupported credential type', 400);
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
