// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { authMiddleware } from '../../middlewares';
import { handleGetStatusList, handleSetStatus } from './status.controller';

export const statusRoutes = Router();

statusRoutes.post('/', authMiddleware, handleSetStatus);
statusRoutes.get('/:statusId', handleGetStatusList);
