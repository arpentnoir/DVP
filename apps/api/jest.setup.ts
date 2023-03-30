process.env.DOCUMENT_STORAGE_BUCKET_NAME = 'storage-api-bucket';
process.env.AWS_REGION = 'ap-southeast-2';
process.env.API_URL = 'api';
process.env.CLIENT_URL = 'client';
process.env.DYNAMODB_DOCUMENTS_TABLE = 'documents';
process.env.KMS_KEY_ID = 'fake kms id';
process.env.REVOCATION_LIST_BUCKET_NAME = 'revocation-bucket';
process.env.REVOCATION_LIST_BIT_STRING_LENGTH = '8';
process.env.REVOCATION_QUEUE_URL =
  'http://localhost:4566/000000000000/local-document-revocation-queue';
