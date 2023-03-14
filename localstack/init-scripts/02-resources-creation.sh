#!bin/bash

echo "-------------------------------------Script-02"

LOCALSTACK_ENDPOINT=http://localhost:4566

alias awslocal="aws --endpoint-url ${LOCALSTACK_ENDPOINT}" --profile=localstack

awslocal --version
echo "########### Creating SQS ###########"
awslocal sqs create-queue --queue-name local-document-schema-queue
awslocal sqs list-queues

echo "########### Creating S3 buckets  ###########"

S3_STORAGE_BUCKET=local-document-storage-bucket
S3_REVOCATION_BUCKET=local-revocation-bucket

BUCKET_EXISTS=$(awslocal s3api head-bucket --bucket $S3_STORAGE_BUCKET 2>&1 || true)
if [ -z "$BUCKET_EXISTS" ]; then
  echo "S3 storage bucket exists"
else
  awslocal s3 mb "s3://$S3_STORAGE_BUCKET"
fi

REVOCATION_BUCKET_EXISTS=$(awslocal s3api head-bucket --bucket $S3_REVOCATION_BUCKET 2>&1 || true)
if [ -z "$REVOCATION_BUCKET_EXISTS" ]; then
  echo "S3 revocation bucket exists"
else
  awslocal s3 mb "s3://$S3_REVOCATION_BUCKET"
fi

echo "########### Creating Dynamodb table  ###########"

DYNAMO_TABLE_NAME=local-documents-tables

if awslocal dynamodb list-tables | grep -q "$DYNAMO_TABLE_NAME"
then
  echo "Dyamodb table exists"
else
  awslocal dynamodb create-table \
      --table-name "$DYNAMO_TABLE_NAME" \
      --attribute-definitions \
          AttributeName=pk,AttributeType=S \
          AttributeName=sk,AttributeType=S \
          AttributeName=gs1pk,AttributeType=S \
          AttributeName=gs1sk,AttributeType=S \
          AttributeName=gs2pk,AttributeType=S \
          AttributeName=gs2sk,AttributeType=S \
      --key-schema \
          AttributeName=pk,KeyType=HASH \
          AttributeName=sk,KeyType=RANGE \
      --billing-mode=PAY_PER_REQUEST \
      --global-secondary-indexes \
          "[
              {
                  \"IndexName\": \"gs1\",
                  \"KeySchema\": [{\"AttributeName\":\"gs1pk\",\"KeyType\":\"HASH\"},
                                  {\"AttributeName\":\"gs1sk\",\"KeyType\":\"RANGE\"}],
                  \"Projection\":{
                      \"ProjectionType\":\"ALL\"
                  }
              },
               {
                  \"IndexName\": \"gs2\",
                  \"KeySchema\": [{\"AttributeName\":\"gs2pk\",\"KeyType\":\"HASH\"},
                                  {\"AttributeName\":\"gs2sk\",\"KeyType\":\"RANGE\"}],
                  \"Projection\":{
                      \"ProjectionType\":\"ALL\"
                  }
              }
          ]"

fi

echo "############ Creating Cognito resources #############"
echo "############ Skipping because cognito is only available in Localstack Pro #############"

echo "############ Localstack ready ##############"

# External

# if aws cognito-idp list-user-pools --max-results 10 | grep -q "local-cognito-userpool"
# then
#   echo "External cognito setup exists"
# else
#   pool_id=$(awslocal cognito-idp create-user-pool --pool-name local-cognito-userpool | jq -rc ".UserPool.Id")
#   client_id=$(awslocal cognito-idp create-user-pool-client --user-pool-id "$pool_id" --client-name local-cognito-userpool-client | jq -rc ".UserPoolClient.ClientId")

#   awslocal cognito-idp sign-up --client-id "$client_id" --username local_dvp_dev --password 12345678Aa!
#   awslocal cognito-idp admin-confirm-sign-up --username local_dvp_dev --user-pool-id "$pool_id"
# fi

# # internal

# if aws cognito-idp list-user-pools --max-results 10 | grep -q "local-cognito-userpool-internal"
# then
#   echo "External cognito setup exists"
# else
#   int_pool_id=$(awslocal cognito-idp create-user-pool --pool-name local-cognito-userpool-internal | jq -rc ".UserPool.Id")
#   int_client_id=$(awslocal cognito-idp create-user-pool-client --user-pool-id "$int_pool_id" --client-name local-cognito-userpool-client-internal | jq -rc ".UserPoolClient.ClientId")

#   awslocal cognito-idp sign-up --client-id "$int_client_id" --username local_dvp_dev_int --password 12345678Aa!
#   awslocal cognito-idp admin-confirm-sign-up --username local_dvp_dev_int --user-pool-id "$int_pool_id"
# fi
