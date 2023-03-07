import { Router } from 'express';
import { getDocumentSchemas } from './document-schema.controller';

export const documentSchemaRoutes = Router();

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
documentSchemaRoutes.get('/', getDocumentSchemas);
