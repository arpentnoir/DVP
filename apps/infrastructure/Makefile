SHELL := /bin/bash

# Default env variables
APP_NAME = dvp
ENV ?= preprod

AWS_REGION ?= ap-southeast-2
AWS_ACCOUNT_ID ?= 580315648792
AWS_ROLENAME ?= codeontap-automation
PULUMI_STATE_URL ?= s3://${AWS_ACCOUNT_ID}-${APP_NAME}-${ENV}-pulumi-state
PULUMI_CONFIG_PASSPHRASE ?=
TARGET_DOMAIN ?= dvp.ha.showthething.com
DVP_API_DOMAIN ?= api.${ENV}.${TARGET_DOMAIN}
DVP_DOMAIN ?= web.${ENV}.${TARGET_DOMAIN}
SEED_CONFIG_FILE_ID ?= 62df6b09f2e363392e196aac
CONFIGFILE_DATABASE_COLLECTION_NAME ?= configFile
DATABASE_SERVER_SELECTION_TIMEOUT ?= 3000

.EXPORT_ALL_VARIABLES: ; # send all vars to shell

### Deployment
pulumi-preview:
	. src/scripts/run-pulumi.sh preview

pulumi-up:
	. src/scripts/run-pulumi.sh up

pulumi-destroy:
	. src/scripts/run-pulumi.sh destroy