import { DocumentSchemaUpdateRequest } from '@dvp/admin-api-client';
import { NextFunction, Request, Response } from 'express';
import { DocumentSchemaService } from './document-schema.service';

/**
 * Route handler for document schema update - [PUT] `/v1/document-schemas/:schemaId`
 * @param req {Request} express request object
 * @param res {Response} express response object
 * @param next {NextFunction} express callback function
 */
export const updateDocumentSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { schemaId } = req.params;
  const documentSchemaService = new DocumentSchemaService(
    req.invocationContext
  );

  try {
    const schema = await documentSchemaService.updateDocumentSchema(
      schemaId,
      req.body as DocumentSchemaUpdateRequest
    );
    res.status(200).json(schema);
  } catch (err) {
    next(err);
  }
};
