import { Router } from 'express';
import { updateDocumentSchema } from './document-schema.controller';

export const documentSchemaRoutes = Router();

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
documentSchemaRoutes.put('/:schemaId', updateDocumentSchema);
