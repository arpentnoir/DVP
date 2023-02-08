import { Router } from 'express';
import { authMiddleware } from '../../middlewares';
import { handleIssue } from './issue.controller';

export const issueRoutes = Router();

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
issueRoutes.post('/', authMiddleware, handleIssue);
