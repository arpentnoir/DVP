import { IssueCredentialRequest } from '@dvp/api-client';

import type { NextFunction, Request, Response } from 'express';

import { IssueService } from './issue.service';

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
