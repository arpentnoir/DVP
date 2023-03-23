import { IssueCredentialRequestSigningMethodEnum } from '@dvp/api-client';
import { Entity } from 'dynamodb-onetable';

/**
 * Represents the DynamoDB schema. Specifies models for:
 * 
 * Document
 * KeyPair
 * RevocationCounter
 * DocumentSchema
 */
export const DynamoSchema = {
  version: '0.0.1',
  indexes: {
    primary: { hash: 'pk', sort: 'sk' },
    gs1: {
      hash: 'gs1pk',
      sort: 'gs1sk',
    },
    gs2: {
      hash: 'gs2pk',
      sort: 'gs2sk',
    },
  },
  models: {
    Document: {
      pk: { type: String, value: 'Abn#${abn}' },
      sk: { type: String, value: 'Document#${id}' },
      id: { type: String, required: true },
      abn: { type: String, required: true },
      s3Path: { type: String, required: true },
      decryptionKey: { type: String, required: true },
      signingMethod: {
        type: String,
        required: true,
        enum: [
          IssueCredentialRequestSigningMethodEnum.Oa,
          IssueCredentialRequestSigningMethodEnum.Svip,
        ],
      },
      isRevoked: { type: Boolean, default: false },
      revocationIndex: { type: Number },
      revocationS3Path: { type: String },
      createdBy: { type: String, required: true },
      documentHash: { type: String },

      // metadata
      documentNumber: { type: String },
      freeTradeAgreement: { type: String },
      importingJurisdiction: { type: String },
      exporterOrManufacturerAbn: { type: String },
      importerName: { type: String },
      consignmentReferenceNumber: { type: String },
      documentDeclaration: { type: Boolean },
      issueDate: { type: String },
      expiryDate: { type: String },

      // global secondary index
      gs1pk: { type: String, value: 'Document' },
      gs1sk: { type: String, value: 'Document#${id}' },
      gs2pk: { type: String, value: 'DocumentHash' },
      gs2sk: { type: String, value: 'DocumentHash#${documentHash}' },
    },

    KeyPair: {
      pk: { type: String, value: 'Abn#${abn}' },
      sk: { type: String, value: 'KeyPair#${keyId}' },
      abn: { type: String, required: true },

      keyId: { type: String, generate: 'uuid' },
      name: { type: String, required: true, unique: true, scope: '${abn}' },

      kmsId: { type: String, required: true },
      publicKey: { type: String, required: true },
      encryptedPrivateKey: { type: ArrayBuffer, required: true },
      disabled: { type: Boolean, default: false },
      deleted: { type: Boolean, default: false },
      ttl: { type: Number, ttl: true }, //  DynamoDB TTL date(Epoch timestamp) to evict the keypair

      createdBy: { type: String },
      updatedBy: { type: String },
    },

    RevocationCounter: {
      pk: { type: String, value: 'RevocationCounter' },
      sk: { type: String, value: 'RevocationCounter' },
      listCounter: { type: Number, require: true },
      counter: { type: Number, require: true },
      bitStringLength: { type: Number, require: true },
    },

    DocumentSchema: {
      pk: { type: String, value: 'DocumentSchema' },
      sk: { type: String, value: 'DocumentSchema#${name}#${type}' },

      name: { type: String, required: true },
      type: { type: String, required: true, enum: ['full', 'partial'] },
      schemaPath: { type: String },
      uiSchemaPath: { type: String },
    },
  } as const,
  params: {
    isoDates: true,
    timestamps: true,
  },
};

export type DocumentType = Entity<typeof DynamoSchema.models.Document>;
export type KeyPairType = Entity<typeof DynamoSchema.models.KeyPair>;
export type RevocationType = Entity<
  typeof DynamoSchema.models.RevocationCounter
>;
export type DocumentSchemaType = Entity<
  typeof DynamoSchema.models.DocumentSchema
>;
