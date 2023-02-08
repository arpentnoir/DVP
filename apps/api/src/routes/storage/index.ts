// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { authMiddleware } from '../../middlewares';
import { getDocumentById, uploadDocument } from './storage.controller';

export const storageRoutes = Router();

storageRoutes.post('/documents', authMiddleware, uploadDocument);
storageRoutes.get('/documents/:documentId', getDocumentById);
