#!/bin/bash

set -e


echo "The present working directory is $( pwd; )";

echo "aws s3api head-bucket --bucket ${PULUMI_STATE}";

# Check that the schema exists for this environment
SQS_EXISTS=$(aws sqs get-queue-url --queue-name dvp-${ENV}-credential-schemas-event-queue --region ${AWS_REGION} 2>&1 || true)
SQS_EXIST_CHECK="error"

if [[ $SQS_EXISTS == *"$SQS_EXIST_CHECK"* ]]; then
    echo "Error: Schema does not exist for this environment.  Please run the schema pipeline first"
    exit 1
fi

# Create the pulumi state bucket if required
BUCKET_EXISTS=$(aws s3api head-bucket --bucket ${PULUMI_STATE} 2>&1 || true)
if [ ! -z "$BUCKET_EXISTS" ]; then
    aws s3api create-bucket --bucket ${PULUMI_STATE} --region ${AWS_REGION} --create-bucket-configuration LocationConstraint=${AWS_REGION}
    aws s3api wait bucket-exists --bucket ${PULUMI_STATE} --region ${AWS_REGION}
fi

# Login to self-hosted backend
pulumi login ${PULUMI_STATE_URL} -C ./;

pulumi stack select ${APP_NAME}-${ENV} --create -C ./;

# Run pulumi command
if [ $1 = "preview" ]; then
    pulumi preview -s ${APP_NAME}-${ENV} --non-interactive -C ./;
elif [ $1 = "up" ]; then
    pulumi up -s ${APP_NAME}-${ENV} --yes --non-interactive -C ./;
elif [ $1 = "destroy" ]; then
    pulumi cancel -s ${APP_NAME}-${ENV} --yes --non-interactive -C ./;
    pulumi refresh -s ${APP_NAME}-${ENV} --yes --non-interactive -C ./;
    pulumi destroy -s ${APP_NAME}-${ENV} --yes --non-interactive -C ./;
else
  echo "Invalid input arg. Must be one of: ['preview', 'up', 'destroy']"
fi
