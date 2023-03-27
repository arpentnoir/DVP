import { authMiddleware } from '@dvp/server-common';
import { Router } from 'express';
import { documentSchemaRoutes } from './document-schema';

export const router = Router();

router.use('/document-schemas', authMiddleware, documentSchemaRoutes);
