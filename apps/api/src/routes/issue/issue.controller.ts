import { IssueCredentialRequest } from '@dvp/api-client';
import { VerifiableCredential } from '@dvp/api-interfaces';

import type { NextFunction, Request, Response } from 'express';

import { storageClient, StorageService } from '../storage/storage.service';
import { IssueService } from './issue.service';

export const handleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { credential, signingMethod } = req.body as IssueCredentialRequest;

  // Generate a storage url with the id and key and attach to credential
  const storageService = new StorageService(req.invocationContext);
  const { credentialWithQrUrl, documentId, encryptionKey } =
    storageService.embedQrUrl(credential as VerifiableCredential);

  const issueService = new IssueService(req.invocationContext);

  try {
    const issueResult = await issueService.issue(
      signingMethod,
      credentialWithQrUrl
    );

    // Store the issued verifiable credential
    await storageService.uploadDocument(
      storageClient,
      JSON.stringify(issueResult),
      documentId,
      encryptionKey
    );

    res.status(201).json({
      verifiableCredential: issueResult,
      documentId,
      encryptionKey,
    });
  } catch (err) {
    next(err);
  }
};
