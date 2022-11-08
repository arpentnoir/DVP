import * as api from "./api";
import * as staticWebsite from "./client";
import { auditLogBucket, documentDb, kms, vpc } from "./common";



export default async () => ({
  auditLogBucket,
  api,
  vpc,
  documentDb,
  kms,
  staticWebsite
})
