#!bin/bash

echo "-------------------------------------Script-01"

echo "########### Creating profile ###########"

aws configure set aws_access_key_id test_access_key --profile=localstack
aws configure set aws_secret_access_key test_secret_key --profile=localstack
aws configure set region ap-southeast-2 --profile=localstack

echo "########### Listing profile ###########"
aws configure list --profile=localstack

echo "---------------------------------END Script-01"
