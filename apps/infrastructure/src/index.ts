// import * as adminApi from './admin-api';
import * as api from './api';
import * as adminApi from './admin-api';
import * as schemaWorker from './schema-worker';
import * as statusWorker from './status-worker';

import * as staticWebsite from './client';
import { auditLogBucket, auth, dynamodb, kms, vpc } from './common';

export default () => ({
  dynamodb,
  auditLogBucket,
  api,
  adminApi,
  auth,
  vpc,
  kms,
  staticWebsite,
  schemaWorker,
  statusWorker,
});
