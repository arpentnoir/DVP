import * as api from './api';
import * as staticWebsite from './client';
import { auditLogBucket, auth, documentDb, kms, vpc } from './common';

export default () => ({
  auditLogBucket,
  api,
  auth,
  vpc,
  documentDb,
  kms,
  staticWebsite,
});
