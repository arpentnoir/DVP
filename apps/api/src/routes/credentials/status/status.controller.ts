import {
  BadRequestError,
  getUuIdFromUrn,
  NotFoundError,
  SQSClient,
  SystemError,
} from '@dvp/server-common';
import type { NextFunction, Request, Response } from 'express';
import { models } from '../../../db';
import { StorageService } from '../../storage/storage.service';
import { statusStorageClient } from './status.service';

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
 * Submits the revocation request to queue for processing.
 *
 * @param req The request from which to extract the list credential id and status.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware in the stack.
 * @returns A HTTP 200 if successful.
 */
export const handleSubmitToRevocationStatusQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { credentialId, credentialStatus } = req.body;

    const { userAbn } = req.invocationContext;

    const documentId = getUuIdFromUrn(credentialId as string);

    if (!documentId) {
      return next(new NotFoundError(credentialId as string));
    }

    const credential = await models.Document.get({
      id: documentId,
      abn: userAbn,
    });

    if (!credential) {
      return next(new NotFoundError(credentialId as string));
    } else if (credential.revocationInProgress) {
      throw new BadRequestError(
        new Error(
          `Setting revocation status for ${
            credentialId as string
          } already in progress`
        )
      );
    }

    const sqsPayload = {
      documentId,
      credentialStatus,
      invocationContext: req.invocationContext,
    };

    await SQSClient.sendMessage(JSON.stringify(sqsPayload));

    await models.Document.update({
      id: documentId,
      abn: userAbn,
      revocationInProgress: true,
    });

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
