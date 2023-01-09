SHELL := /bin/bash

# Default env variables
APP_NAME = dvp
ENV ?= dev

AWS_REGION ?= ap-southeast-2
AWS_ACCOUNT_ID ?= 580315648792
AWS_ROLENAME ?= codeontap-automation
PULUMI_STATE_URL ?= s3://${AWS_ACCOUNT_ID}-${APP_NAME}-${ENV}-pulumi-state
PULUMI_CONFIG_PASSPHRASE ?=
TARGET_DOMAIN ?= dvp.ha.showthething.com
DVP_API_DOMAIN ?= api.${ENV}.${TARGET_DOMAIN}
DVP_DOMAIN ?= web.${ENV}.${TARGET_DOMAIN}
DVP_INTERNAL_DOMAIN ?= web.${ENV}.internal.${TARGET_DOMAIN}
VC_CONTEXT_ENDPOINT ?=  https://${ENV}-dvp-context.s3.${AWS_REGION}.amazonaws.com
VC_RENDERER_ENDPOINT ?= https://${ENV}.renderer.${TARGET_DOMAIN}
GOOGLE_CLIENT_ID ?= 731800346985-hfemrfo762ggvdvg3f5ij5umq67flr92.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET ?= 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
SEED_CONFIG_FILE_ID ?= 62df6b09f2e363392e196aac
CONFIGFILE_DATABASE_COLLECTION_NAME ?= configFile
DATABASE_SERVER_SELECTION_TIMEOUT ?= 3000

.EXPORT_ALL_VARIABLES: ; # send all vars to shell

# helper command to create a `artifacts` dir locally (mirroring what happens in CI pipeline)
create-artifacts-locally:
	mkdir -p ../../artifacts
	cp -r ../../dist/apps/client-internal/. ../../artifacts/client-internal/
	cp -r ../../dist/apps/client-internet/. ../../artifacts/client-internet/
	cp -r ../../dist/apps/api/. ../../artifacts/api-build/

### Deployment
pulumi-preview:
	. src/scripts/run-pulumi.sh preview

pulumi-up:
	. src/scripts/run-pulumi.sh up

pulumi-destroy:
	. src/scripts/run-pulumi.sh destroy
