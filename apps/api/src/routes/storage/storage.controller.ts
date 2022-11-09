import type { Request, Response, NextFunction } from 'express';
import { EncryptedDocument } from '@dvp/api-interfaces';
import { getDocument } from './storage.service';
import { storageClient } from './storage.service';
import { CustomError, ServerError } from '../../utils';

export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<Record<string, EncryptedDocument>>> => {
  const { documentId } = req.params;

  try {
    const document = await getDocument(storageClient, documentId);
    if (!document) {
      return next(
        new CustomError(
          {
            code: 'DVPAPI-002',
            detail: `Cannot find resource \`${req.originalUrl}\``,
            source: {
              location: 'ID',
              parameter: `${documentId}`,
            },
          },
          404
        )
      );
    }
    return res.send(document);
  } catch (err) {
    return next(
      new ServerError(
        {
          code: 'DVPAPI-001',
          detail: 'System Unavailable.  Try again later.',
        },
        err.message
      )
    );
  }
};
