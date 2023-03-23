import { authMiddleware } from '@dvp/server-common';
import { Router } from 'express';
import { getCredentials } from './credentials.controller';
import { issueRoutes } from './issue';
import { statusRoutes } from './status';
import { validateRoutes } from './validate';
import { verifyRoutes } from './verify';

/** API Routes */
export const credentialsRoutes = Router();

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
credentialsRoutes.get('/', authMiddleware, getCredentials);
credentialsRoutes.use('/issue', authMiddleware, issueRoutes);
credentialsRoutes.use('/status', statusRoutes);
credentialsRoutes.use('/validate', authMiddleware, validateRoutes);
credentialsRoutes.use('/verify', verifyRoutes);
