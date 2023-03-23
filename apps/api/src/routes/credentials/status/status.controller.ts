import { CredentialStatus } from '@dvp/api-client';
import { getUuIdFromUrn, NotFoundError, SystemError } from '@dvp/server-common';
import type { NextFunction, Request, Response } from 'express';
import { models } from '../../../db';
import { StorageService } from '../../storage/storage.service';
import { StatusService, statusStorageClient } from './status.service';

/**
 * Gets the revocation status from DynamoDB for a given document hash.
 * 
 * @param req The request from which to extract the document hash.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware in the stack.
 * @returns A response containing the revocation status and document hash.
 */
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

/**
 * Gets the SVIP revocation list for a given list id. Invokes @see {StorageService}.
 * 
 * @param req The request from which to extract the list id.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware in the stack.
 * @returns A response containing the revocation list.
 */
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

/**
 * Sets the revocation status for a given credential by invoking @see {StatusService.setRevocationStatus}
 * 
 * @param req The request from which to extract the list credential id and status.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware in the stack.
 * @returns A HTTP 200 if successful.
 */
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
