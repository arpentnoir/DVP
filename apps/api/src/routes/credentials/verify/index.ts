import { Router } from 'express';
import { handleVerify } from './verify.controller';

export const verifyRoutes = Router();

// Map API routes to controller functions
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
verifyRoutes.post('/', handleVerify);
