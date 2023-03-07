import { NextFunction, Request, Response } from 'express';
import { DocumentSchemaService } from './document-schema.service';

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
