import { CredentialStatus } from '@dvp/api-client';
import { getUuIdFromUrn, NotFoundError, SystemError } from '@dvp/server-common';
import type { NextFunction, Request, Response } from 'express';
import { models } from '../../../db';
import { StorageService } from '../../storage/storage.service';
import { StatusService, statusStorageClient } from './status.service';

export const handleGetRevocationStatusByDocumentHash = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { documentHash } = req.params;

    const credential = await models.Document.find(
      {
        gs2pk: 'DocumentHash',
        gs2sk: `DocumentHash#${documentHash}`,
      },
      { index: 'gs2' }
    );

    if (credential.length === 0) {
      return next(new NotFoundError(documentHash));
    }

    return res.json({
      revoked: credential[0].isRevoked,
      documentHash,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetSvipRevocationStatusList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { listId } = req.params;

    const storageService = new StorageService(req.invocationContext);

    const revocationList = await storageService.getDocument(
      statusStorageClient,
      listId
    );

    if (!revocationList) {
      return next(new NotFoundError(listId));
    }

    return res.json(revocationList);
  } catch (err) {
    return next(new SystemError(err as Error));
  }
};

export const handleSetRevocationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { credentialId, credentialStatus } = req.body;

    const documentId = getUuIdFromUrn(credentialId as string);

    if (!documentId) {
      return next(new NotFoundError(credentialId as string));
    }

    const statusService = new StatusService(req.invocationContext);

    await statusService.setRevocationStatus(
      documentId,
      credentialStatus as CredentialStatus[]
    );

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
