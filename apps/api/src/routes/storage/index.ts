// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { getDocumentById, uploadDocument } from './storage.controller';

export const storageRoutes = Router();

storageRoutes.post('/documents', uploadDocument);
storageRoutes.get('/documents/:documentId', getDocumentById);
