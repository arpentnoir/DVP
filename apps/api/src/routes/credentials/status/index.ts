// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { authMiddleware } from '@dvp/server-common';
import {
  handleGetRevocationStatusByDocumentHash,
  handleGetSvipRevocationStatusList,
  handleSubmitToRevocationStatusQueue,
} from './status.controller';

export const OAStatusRouteName = 'oa-ocsp';
export const SVIPStatusRouteName = 'revocation-list-2020';

export const statusRoutes = Router();

statusRoutes.post('/', authMiddleware, handleSubmitToRevocationStatusQueue);
statusRoutes.get(
  `/${OAStatusRouteName}/:documentHash`,
  handleGetRevocationStatusByDocumentHash
);
statusRoutes.get(
  `/${SVIPStatusRouteName}/:listId`,
  handleGetSvipRevocationStatusList
);
