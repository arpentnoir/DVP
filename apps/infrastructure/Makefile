SHELL := /bin/bash

# Default env variables
APP_NAME = dvp
ENV ?= e1

AWS_REGION ?= ap-southeast-2
AWS_ACCOUNT_ID ?= 636729270584
PULUMI_STATE ?= ${AWS_ACCOUNT_ID}-${APP_NAME}-${ENV}-pulumi-state
PULUMI_STATE_URL ?= s3://${AWS_ACCOUNT_ID}-${APP_NAME}-${ENV}-pulumi-state
PULUMI_CONFIG_PASSPHRASE ?=
TARGET_DOMAIN ?= nonprod-dvp.cp4.homeaffairs.gov.au
WILDCARD_SSL ?= *.${ENV}.${TARGET_DOMAIN}
DVP_API_DOMAIN ?= api.${ENV}.${TARGET_DOMAIN}
DVP_ADMIN_API_DOMAIN ?= api.${ENV}.internal.${TARGET_DOMAIN}
DVP_API_INTERNAL_PATH ?= /v1
DVP_ADMIN_API_INTERNAL_PATH ?= /v1
DVP_DOMAIN ?= web.${ENV}.${TARGET_DOMAIN}
DVP_INTERNAL_DOMAIN ?= web.${ENV}.internal.${TARGET_DOMAIN}
VC_CONTEXT_ENDPOINT ?= https://context.${ENV}.${TARGET_DOMAIN}
VC_RENDERER_ENDPOINT ?= https://renderer.${ENV}.${TARGET_DOMAIN}
# TODO Temporarily set to test revocation with a small numeber of VCs
# Once the feature is tested, this value can be removed and bit length defaults to 16KB
REVOCATION_LIST_BIT_STRING_LENGTH ?= 8

.EXPORT_ALL_VARIABLES: ; # send all vars to shell

# helper command to create a `artifacts` dir locally (mirroring what happens in CI pipeline)
create-artifacts-locally:
	mkdir -p ../../artifacts
	cp -r ../../dist/apps/client-internal/. ../../artifacts/client-internal/
	cp -r ../../dist/apps/client-internet/. ../../artifacts/client-internet/
	cp -r ../../dist/apps/api/. ../../artifacts/api-build/
	cp -r ../../dist/apps/admin-api/. ../../artifacts/admin-api-build/
	cp -r ../../dist/apps/schema-worker/. ../../artifacts/schema-worker-build/

### Deployment
pulumi-preview:
	. src/scripts/run-pulumi.sh preview

pulumi-up:
	. src/scripts/run-pulumi.sh up

pulumi-destroy:
	. src/scripts/run-pulumi.sh destroy
