import { Entity } from 'dynamodb-onetable';

export const DynamoSchema = {
  version: '0.0.1',
  indexes: {
    primary: { hash: 'pk', sort: 'sk' },
    gs1: {
      hash: 'gs1pk',
      sort: 'gs1sk',
    },
  },
  models: {
    Document: {
      pk: { type: String, value: 'abn#{abn}' },
      sk: { type: String, value: 'document#${id}' },
      id: { type: String, generate: 'uuid' },
      userId: { type: String, required: true },
      abn: { type: String, required: true },
      s3Path: { type: String },

      // add document fields
      gs1pk: { type: String, value: 'document' },
      gs1sk: { type: String, value: 'document#${id}' },
    },
    RevocationCounter: {
      pk: { type: String, value: 'RevocationCounter' },
      sk: { type: String, value: 'RevocationCounter' },
      path: { type: String, required: true },
      counter: { type: Number, required: true },
    },
  } as const,
  params: {
    isoDates: true,
    timestamps: true,
  },
};

export type DocumentType = Entity<typeof DynamoSchema.models.Document>;
export type RevocationType = Entity<
  typeof DynamoSchema.models.RevocationCounter
>;
