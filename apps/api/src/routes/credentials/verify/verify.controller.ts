import { VerifiableCredential } from '@dvp/api-interfaces';
import type { Request, Response } from 'express';
import { VerifyService } from './verify.service';

/**
 * Verifies a Verifiable Credential by invoking @see {VerifyService}.
 * 
 * @param req The request from which to extract the verifiable credential.
 * @param res The Express response to be returned.
 * @returns A HTTP 400 if verification fails. 
 * If successful, returns the result of invoking @see {VerifyService.verify}
 */
export const handleVerify = async (req: Request, res: Response) => {
  const { verifiableCredential } = req.body;

  const verifyService = new VerifyService(req.invocationContext);
  const verificationResult = await verifyService.verify(
    verifiableCredential as VerifiableCredential
  );

  if (verificationResult.errors.length > 0) {
    req.logger.debug(
      '[verify.handleVerify] Verification Errors, %o',
      verificationResult.errors
    );
    res.status(400);
  }
  return res.json(verificationResult);
};
