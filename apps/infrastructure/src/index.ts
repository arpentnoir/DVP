import * as api from './api';
import * as staticWebsite from './client';
import { auditLogBucket, auth, dynamodb, kms, vpc } from './common';

export default () => ({
  dynamodb,
  auditLogBucket,
  api,
  auth,
  vpc,
  kms,
  staticWebsite,
});
