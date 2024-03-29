process.env.DOCUMENT_STORAGE_BUCKET_NAME = 'local-document-storage-bucket';
process.env.AWS_REGION = 'ap-southeast-2';
process.env.API_URL = 'http://localhost:3333/v1';
process.env.CLIENT_URL = 'http://localhost:4200';
process.env.DYNAMODB_DOCUMENTS_TABLE = 'local-documents-tables';
process.env.KMS_KEY_ID = 'fake kms id';
process.env.REVOCATION_LIST_BUCKET_NAME = 'local-revocation-bucket';
process.env.REVOCATION_LIST_BIT_STRING_LENGTH = '8';
process.env.DEBUG_CONSOLE = 'true';
process.env.AWS_ACCESS_KEY_ID = 'test_access_key';
process.env.AWS_SECRET_ACCESS_KEY = 'test_secret_key';
