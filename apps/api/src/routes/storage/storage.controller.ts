import { EncryptedDocument } from '@dvp/api-interfaces';
import { NotFoundError, SystemError } from '@dvp/server-common';
import type { NextFunction, Request, Response } from 'express';
import { storageClient, StorageService } from './storage.service';

export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<Record<string, EncryptedDocument>>> => {
  const { documentId } = req.params;

  try {
    const storageService = new StorageService(req.invocationContext);
    const document = await storageService.getDocument(
      storageClient,
      documentId
    );
    if (!document) {
      return next(new NotFoundError(`${req.originalUrl}/${documentId}`));
    }
    return res.send(document);
  } catch (err) {
    return next(new SystemError(err));
  }
};
