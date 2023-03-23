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
