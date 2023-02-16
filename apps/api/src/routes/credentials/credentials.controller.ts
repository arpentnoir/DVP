import { NextFunction, Request, Response } from 'express';
import { CredentialService } from './credentials.service';

export const getCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const credentialService = new CredentialService(req.invocationContext);

  try {
    const credentials = await credentialService.getCredentials(req.query);
    res.status(200).json(credentials);
  } catch (err) {
    next(err);
  }
};
