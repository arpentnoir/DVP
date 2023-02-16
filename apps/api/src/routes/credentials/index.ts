import { Router } from 'express';
import { authMiddleware } from '../../middlewares';
import { getCredentials } from './credentials.controller';
import { issueRoutes } from './issue';
import { validateRoutes } from './validate';
import { verifyRoutes } from './verify';

export const credentialsRoutes = Router();

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
credentialsRoutes.get('/', authMiddleware, getCredentials);
credentialsRoutes.use('/issue', authMiddleware, issueRoutes);
credentialsRoutes.use('/validate', authMiddleware, validateRoutes);
credentialsRoutes.use('/verify', verifyRoutes);
