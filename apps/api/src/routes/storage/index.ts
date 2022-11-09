import { Router } from 'express';
import { getDocumentById } from './storage.controller';

export const storageRoutes = Router();

storageRoutes.get('/documents/:documentId', getDocumentById);
