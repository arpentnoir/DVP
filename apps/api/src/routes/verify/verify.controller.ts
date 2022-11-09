import { VerifyService } from './verify.service';
import type { Request, Response } from 'express';

export const handleVerify = async (req: Request, res: Response) => {
  const { verifiableCredential, options } = req.body;

  const verifyService = new VerifyService();
  const verificationResult = await verifyService.verify(verifiableCredential, options);

  if (verificationResult.errors.length > 0) {
    console.log(verificationResult.errors);
    res.status(400);
  }
  console.log(JSON.stringify(verificationResult));
  return res.json({ data: verificationResult });
};
