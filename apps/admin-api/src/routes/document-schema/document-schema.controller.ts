import { DocumentSchemaUpdateRequest } from '@dvp/admin-api-client';
import { NextFunction, Request, Response } from 'express';
import { DocumentSchemaService } from './document-schema.service';

/**
 * Gets document schemas by invoking the @see {DocumentSchemaService}.
 *
 * @param req The request from which to extract the document schema query.
 * @param res The Express response to be returned.
 * @param next The next function injected by the Express router which, when invoked, executes the next middleware in the stack.
 * @returns HTTP 200 containing document schemas.
 */
export const getDocumentSchemas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const documentSchemaService = new DocumentSchemaService(
    req.invocationContext
  );

  try {
    const schemas = await documentSchemaService.getDocumentSchemas(req.query);
    res.status(200).json(schemas);
  } catch (err) {
    next(err);
  }
};

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
