// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import {
  getDocumentSchemas,
  updateDocumentSchema,
} from './document-schema.controller';

export const documentSchemaRoutes = Router();

documentSchemaRoutes
  .get('/', getDocumentSchemas)
  .put('/:schemaId', updateDocumentSchema);
