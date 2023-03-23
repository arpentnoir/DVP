import { NextFunction, Request, Response } from 'express';
import { CredentialService } from './credentials.service';

/**
 * Gets a Verifiable Credential by invoking @see {CredentialService}
 * 
 * @param req The request from which to extract the query used to get the VC.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware in the stack.
 * @returns A HTTP 400 containing the VC as returned by @see {CredentialService.getCredentials}.
 */
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
