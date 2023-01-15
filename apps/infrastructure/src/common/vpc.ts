import * as pulumi from '@pulumi/pulumi';
import { Components } from 'gs-pulumi-library';

import { auditLogBucket } from '../common/auditLogBucket';

const stack = pulumi.getStack();

//
// Create `dvpVpc` and S3 Bucket for VPC Flowlogs
const flowlogBucket = new Components.aws.S3Bucket(`${stack}-dvp-vpc-flowlogs`, {
  description: 'S3 Bucket for `dvpWebsite` static website contents.',
  bucketName: `${stack}-dvp-vpc-flowlogs`,
  logBucket: auditLogBucket.bucket,
  logBucketPrefix: `s3/dvp-vpc-flowlogs/`,
  forceDestroy: true,
});

const dvpVpc = new Components.aws.Vpc(`${stack}-dvp-vpc`, {
  vpcName: `${stack}-dvp-vpc`,
  description: 'VPC for the dvp W3C API / UI',
  flowlogBucket: flowlogBucket.bucket,
});

export const dvpVpcDefaultSecurityGroupId = dvpVpc.vpcDefaultSecurityGroupId();
export const dvpVpcId = dvpVpc.vpcId();
export const dvpVpcPrivateSubnetIds = dvpVpc.privateSubnetIds();
export const dvpVpcPublicSubnetIds = dvpVpc.publicSubnetIds();
