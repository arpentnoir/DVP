// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { authMiddleware } from '@dvp/server-common';
import {
  handleGetRevocationStatusByDocumentHash,
  handleGetSvipRevocationStatusList,
  handleSetRevocationStatus,
} from './status.controller';

export const OAStatusRouteName = 'oa-ocsp';
export const SVIPStatusRouteName = 'revocation-list-2020';

export const statusRoutes = Router();

// Map API routes to controller functions
statusRoutes.post('/', authMiddleware, handleSetRevocationStatus);
statusRoutes.get(
  `/${OAStatusRouteName}/:documentHash`,
  handleGetRevocationStatusByDocumentHash
);
statusRoutes.get(
  `/${SVIPStatusRouteName}/:listId`,
  handleGetSvipRevocationStatusList
);
