// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
/* eslint-disable @typescript-eslint/no-misused-promises */
import { authMiddleware } from '@dvp/server-common';
import { Router } from 'express';
import { handleGetStatusList, handleSetStatus } from './status.controller';

export const statusRoutes = Router();

statusRoutes.post('/', authMiddleware, handleSetStatus);
statusRoutes.get('/:statusId', handleGetStatusList);
