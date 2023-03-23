import { EncryptedDocument } from '@dvp/api-interfaces';
import { NotFoundError, SystemError } from '@dvp/server-common';
import type { NextFunction, Request, Response } from 'express';
import { storageClient, StorageService } from './storage.service';

/**
 * Gets an encrypted document by invoking the @see {StorageService}.
 * Gracefully handles the case where a document with the given documentId cannot be found.
 * 
 * @param req The request from which to extract the documentId.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware in the stack. 
 *             Used here for error handling
 * @returns The encrypted document.
 */
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
      return next(new NotFoundError(req.originalUrl));
    }
    return res.json(document);
  } catch (err) {
    return next(new SystemError(err as Error));
  }
};

/**
 * Uploads a document by invoking the @see {StorageService}.
 * 
 * @param req The request from which to extract the documentId, document and encryptionKey.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware.
 * @returns The encrypted document.
 */
export const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<Record<string, EncryptedDocument>>> => {
  const { document, encryptionKey, documentId } = req.body;

  try {
    const storageService = new StorageService(req.invocationContext);
    const result = await storageService.uploadDocument({
      storageClient,
      document,
      documentId,
      encryptionKey,
    });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};
