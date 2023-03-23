import { Router } from 'express';
import { handleIssue } from './issue.controller';

export const issueRoutes = Router();

// Map API routes to controller functions
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
issueRoutes.post('/', handleIssue);
