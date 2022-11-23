import type { NextFunction, Request, Response } from 'express';
import { VerifiableCredential } from '@dvp/api-interfaces';
import { SystemError } from '@dvp/server-common';

import { IssueService } from './issue.service';
import { storageClient, StorageService } from '../storage/storage.service';

export const handleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { credential } = req.body;

    // Generate a storage url with the id and key and attach to credential
    const storageService = new StorageService(req.invocationContext);
    const { credentialWithQrUrl, documentId, encryptionKey } =
      storageService.embedQrUrl(credential as VerifiableCredential);

    const issueService = new IssueService(req.invocationContext);

    const issueResult = await issueService.issue(credentialWithQrUrl);

    // Store the issued verifiable credential
    await storageService.uploadDocument(
      storageClient,
      JSON.stringify(issueResult),
      documentId,
      encryptionKey
    );

    return res.status(201).json({
      verifiableCredential: issueResult,
      documentId,
      encryptionKey,
    });
  } catch (err) {
    return next(new SystemError(err as Error));
  }
};
