// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
/* eslint-disable @typescript-eslint/no-misused-promises */
import { authMiddleware } from '@dvp/server-common';
import { Router } from 'express';
import { getDocumentById, uploadDocument } from './storage.controller';

export const storageRoutes = Router();

// Map API routes to controller functions 
storageRoutes.post('/documents', authMiddleware, uploadDocument);
storageRoutes.get('/documents/:documentId', getDocumentById);
