import type { Request, Response } from 'express';
import { VerifyService } from './verify.service';

export const handleVerify = async (req: Request, res: Response) => {
  const { verifiableCredential, options } = req.body;

  const verifyService = new VerifyService(req.invocationContext);
  const verificationResult = await verifyService.verify(
    verifiableCredential,
    options
  );

  if (verificationResult.errors.length > 0) {
    req.logger.debug('[verify.handleVerify] Verification Errors, %o', verificationResult.errors)
    res.status(400);
  }
  return res.json(verificationResult);
};
