import type { NextFunction, Request, Response } from 'express';
import { VerifiableCredential } from '@dvp/api-interfaces';

import { IssueService } from './issue.service';

export const handleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { credential } = req.body;

    const issueService = new IssueService(req.invocationContext);

    const issueResult = await issueService.issue(
      credential as VerifiableCredential
    );

    return res.status(201).json(issueResult);
  } catch (err) {
    next(err);
  }
};
