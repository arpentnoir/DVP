import { IssueCredentialRequest } from '@dvp/api-client';

import type { NextFunction, Request, Response } from 'express';

import { IssueService } from './issue.service';

/**
 * Issues a Verifiable Credential by invoking the @see {IssueService}.
 * 
 * @param req The request from which to extract the credential and signing method.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware in the stack.
 * @returns A HTTP 201 containing the verifiable credential, documentId and public encryption key.
 */
export const handleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { credential, signingMethod } = req.body as IssueCredentialRequest;

  const issueService = new IssueService(req.invocationContext);

  try {
    const { verifiableCredential, documentId, encryptionKey } =
      await issueService.issue(signingMethod, credential);

    res.status(201).json({
      verifiableCredential,
      documentId,
      encryptionKey,
    });
  } catch (err) {
    next(err);
  }
};
