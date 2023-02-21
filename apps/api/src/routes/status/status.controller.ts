import { CredentialStatus } from '@dvp/api-client';
import { NotFoundError, SystemError } from '@dvp/server-common';
import type { NextFunction, Request, Response } from 'express';
import { StorageService } from '../storage/storage.service';
import { StatusService, statusStorageClient } from './status.service';

export const handleGetStatusList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { statusId } = req.params;

    const storageService = new StorageService(req.invocationContext);

    const revocationList = await storageService.getDocument(
      statusStorageClient,
      statusId
    );

    if (!revocationList) {
      return next(new NotFoundError(statusId));
    }

    return res.json(revocationList);
  } catch (err) {
    return next(new SystemError(err as Error));
  }
};

export const handleSetStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { credentialId, credentialStatus } = req.body;

    const statusService = new StatusService(req.invocationContext);

    await statusService.setStatus(
      credentialId as string,
      credentialStatus as CredentialStatus[]
    );

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
