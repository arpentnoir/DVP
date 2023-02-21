import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  HeadObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { IssueCredentialRequestSigningMethodEnum } from '@dvp/api-client';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import request from 'supertest';
import { app } from '../../app';
import unsignedSvip from '../../fixtures/genericvc/degree_unsigned.json';
import oa_doc_base from '../../fixtures/oav3/did.json';
import validAANZFTA_COO from '../../fixtures/validateabledata/validAANZFTA_COO.json';
import {
  authTokenWithoutAbn,
  authTokenWithoutSub,
  authTokenWithSubAndAbn,
} from './utils';

let oa_doc;

const s3Mock = mockClient(S3Client);
const dynamodbMock = mockClient(DynamoDBClient);

const partialCoo = {
  ...validAANZFTA_COO.verifiableCredential,
  credentialSubject: {
    iD: '0003625',
    freeTradeAgreement: 'AANZFTA',
    importingJurisdiction: 'Indonesia',
    exporterOrManufacturerAbn: '55004094599',
    importerName: 'ABC Imports',
    consignmentReferenceNumber: '15688545563',
    documentDeclaration: true,
    originalDocument: 'doc',
  },
};
const fullCoo = {
  ...validAANZFTA_COO.verifiableCredential,
  credentialSubject: {
    iD: '000253',
    supplyChainConsignment: {
      iD: 'dbschenker.com:hawb:DBS626578',
      importCountry: { name: 'Singapore' },
      consignor: { iD: '95307094535' },
      consignee: { name: 'East meets west fine wines' },
    },
  },
};

describe('issue api', () => {
  jest.setTimeout(20000);
  const endpoint = '/api/credentials/issue';

  beforeEach(() => {
    s3Mock.reset();
    dynamodbMock.reset();
  });

  describe('POST /api/credentials/issue', () => {
    beforeEach(() => {
      oa_doc = JSON.parse(JSON.stringify(oa_doc_base));
    });

    it('should issue an OA verifiable credential', async () => {
      s3Mock.on(PutObjectCommand).resolvesOnce({});
      s3Mock.on(HeadObjectCommand).rejects({});
      dynamodbMock.on(PutItemCommand).resolvesOnce({});

      await request(app)
        .post(endpoint)
        .send({
          credential: oa_doc,
          signingMethod: IssueCredentialRequestSigningMethodEnum.Oa,
        })
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .expect(201)
        .expect((res) => {
          expect(res.body.verifiableCredential).toHaveProperty('proof');
          expect(res);
        });
    });

    it('should return bad request for non VC compliant document', async () => {
      await request(app)
        .post(endpoint)
        .send({
          test: 'test',
        })
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .expect(400)
        .expect((res) => {
          expect(res.body.errors[0].detail).toStrictEqual(
            "/body/credential: must have required property 'credential'"
          );
        });
    });

    it('should issue a non-OA verifiable credential', async () => {
      s3Mock.on(PutObjectCommand).resolvesOnce({});
      s3Mock.on(HeadObjectCommand).rejectsOnce({});

      dynamodbMock.on(GetItemCommand).resolves({
        Item: {
          counter: { N: '0' },
          listCounter: { S: '1' },
          bitStringLength: { N: '8' },
        },
      });
      dynamodbMock.on(UpdateItemCommand).resolves({
        Attributes: {
          counter: { N: '1' },
          listCounter: { N: '1' },
        },
      });
      dynamodbMock.on(PutItemCommand).resolves({});

      await request(app)
        .post(endpoint)
        .send({
          credential: unsignedSvip,
          signingMethod: IssueCredentialRequestSigningMethodEnum.Svip,
        })
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .expect(201)
        .expect((res) => {
          expect(res.body.verifiableCredential).toHaveProperty('proof');
          expect(res);
        });

      //   RevocationCounter is increased to 1
      expect(dynamodbMock).toHaveReceivedNthCommandWith(4, UpdateItemCommand, {
        ExpressionAttributeValues: expect.objectContaining({
          ':_0': { N: '1' },
          ':_1': { N: '1' },
        }),
      });
    });

    it('should return error if a property of credentialSubject is not defined in context', async () => {
      await request(app)
        .post(endpoint)
        .send({
          credential: { ...oa_doc, credentialSubject: { test: 'test' } },
        })
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect('Content-Type', /json/)
        .expect(500)
        .expect((res) => {
          expect(res.body.errors[0].detail).toContain(
            'An internal system error has occurred.'
          );
        });
    });

    describe('issue and store', () => {
      it('should issue an OA verifiable credential with QRUrl and return documentId and key', async () => {
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        s3Mock.on(HeadObjectCommand).rejects({});
        dynamodbMock.on(PutItemCommand).resolvesOnce({});

        await request(app)
          .post(endpoint)
          .send({
            credential: oa_doc,
          })
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect('Content-Type', /json/)
          .expect(201)
          .expect((res) => {
            expect(
              res.body.verifiableCredential.credentialSubject.links.self.href
            ).toBeDefined();
            expect(res.body.encryptionKey).toBeDefined();
            expect(res.body.documentId).toBeDefined();
          });
      });

      it('should return error if failed to store VC', async () => {
        s3Mock.on(HeadObjectCommand).resolvesOnce({});
        dynamodbMock.on(PutItemCommand).resolvesOnce({});

        await request(app)
          .post(endpoint)
          .send({
            credential: oa_doc,
            signingMethod: IssueCredentialRequestSigningMethodEnum.Oa,
          })
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect('Content-Type', /json/)
          .expect(422)
          .expect((res) => {
            expect(res.body.errors[0].id).toContain('DVPAPI-002');
          });
      });

      it('should save the partial CoO metadata to the database', async () => {
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        s3Mock.on(HeadObjectCommand).rejects({});
        dynamodbMock.on(PutItemCommand).resolvesOnce({});

        await request(app)
          .post(endpoint)
          .set({ Authorization: authTokenWithSubAndAbn })
          .send({
            credential: partialCoo,
          })
          .expect('Content-Type', /json/)
          .expect(201)
          .expect((res) => {
            expect(dynamodbMock).toHaveReceivedNthCommandWith(
              1,
              PutItemCommand,
              {
                Item: expect.objectContaining({
                  abn: { S: '00000000000' },
                  consignmentReferenceNumber: { S: '15688545563' },
                  createdBy: { S: '1234567890' },
                  decryptionKey: {
                    S: res.body.encryptionKey,
                  },
                  documentDeclaration: { BOOL: true },
                  documentNumber: { S: '0003625' },
                  exporterOrManufacturerAbn: { S: '55004094599' },
                  freeTradeAgreement: { S: 'AANZFTA' },
                  id: { S: res.body.documentId },
                  importerName: { S: 'ABC Imports' },
                  importingJurisdiction: { S: 'Indonesia' },
                  isRevoked: { BOOL: false },
                  s3Path: { S: `documents/${res.body.documentId as string}` },
                }),
              }
            );
            expect(
              res.body.verifiableCredential.credentialSubject.links.self.href
            ).toBeDefined();
            expect(res.body.encryptionKey).toBeDefined();
            expect(res.body.documentId).toBeDefined();
          });
      });

      it('should save the full CoO metadata to the database', async () => {
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        s3Mock.on(HeadObjectCommand).rejects({});
        dynamodbMock.on(PutItemCommand).resolvesOnce({});

        await request(app)
          .post(endpoint)
          .send({
            credential: fullCoo,
          })
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect('Content-Type', /json/)
          .expect(201)
          .expect((res) => {
            expect(dynamodbMock).toHaveReceivedNthCommandWith(
              1,
              PutItemCommand,
              {
                Item: expect.objectContaining({
                  abn: { S: '00000000000' },
                  consignmentReferenceNumber: {
                    S: 'dbschenker.com:hawb:DBS626578',
                  },
                  createdBy: { S: '1234567890' },
                  decryptionKey: {
                    S: res.body.encryptionKey,
                  },
                  documentNumber: { S: '000253' },
                  exporterOrManufacturerAbn: { S: '95307094535' },
                  id: { S: res.body.documentId },
                  importerName: { S: 'East meets west fine wines' },
                  importingJurisdiction: { S: 'Singapore' },
                  isRevoked: { BOOL: false },
                  s3Path: { S: `documents/${res.body.documentId as string}` },
                }),
              }
            );
            expect(
              res.body.verifiableCredential.credentialSubject.links.self.href
            ).toBeDefined();
            expect(res.body.encryptionKey).toBeDefined();
            expect(res.body.documentId).toBeDefined();
          });
      });

      it('should save the generic vc metadata to the database', async () => {
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        dynamodbMock.on(PutItemCommand).resolvesOnce({});

        await request(app)
          .post(endpoint)
          .send({
            credential: oa_doc,
          })
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect('Content-Type', /json/)
          .expect(201)
          .expect((res) => {
            expect(dynamodbMock).toHaveReceivedNthCommandWith(
              1,
              PutItemCommand,
              {
                Item: expect.objectContaining({
                  abn: { S: '00000000000' },
                  createdBy: { S: '1234567890' },
                  decryptionKey: {
                    S: res.body.encryptionKey,
                  },
                  id: { S: res.body.documentId },
                  isRevoked: { BOOL: false },
                  s3Path: { S: `documents/${res.body.documentId as string}` },
                }),
              }
            );
            expect(
              res.body.verifiableCredential.credentialSubject.links.self.href
            ).toBeDefined();
            expect(res.body.encryptionKey).toBeDefined();
            expect(res.body.documentId).toBeDefined();
          });
      });

      it('should use the default abn if an abn is not supplied in the access token payload', async () => {
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        dynamodbMock.on(PutItemCommand).resolvesOnce({});

        await request(app)
          .post(endpoint)
          .send({
            credential: oa_doc,
          })
          .set({ Authorization: authTokenWithoutAbn })
          .expect('Content-Type', /json/)
          .expect(201)
          .expect((res) => {
            expect(dynamodbMock).toHaveReceivedNthCommandWith(
              1,
              PutItemCommand,
              {
                Item: expect.objectContaining({
                  abn: { S: '41161080146' },
                  createdBy: { S: '1234567890' },
                  decryptionKey: {
                    S: res.body.encryptionKey,
                  },
                  id: { S: res.body.documentId },
                  isRevoked: { BOOL: false },
                  s3Path: { S: `documents/${res.body.documentId as string}` },
                }),
              }
            );
            expect(
              res.body.verifiableCredential.credentialSubject.links.self.href
            ).toBeDefined();
            expect(res.body.encryptionKey).toBeDefined();
            expect(res.body.documentId).toBeDefined();
          });
      });

      it('should delete the stored vc and return an error if it fails to store the metadata to the database', async () => {
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        s3Mock.on(DeleteObjectCommand).resolvesOnce({});
        dynamodbMock.on(PutItemCommand).rejectsOnce({});

        await request(app)
          .post(endpoint)
          .set('Authorization', authTokenWithSubAndAbn)
          .send({
            credential: oa_doc,
          })
          .expect('Content-Type', /json/)
          .expect(500)
          .expect((res) => {
            expect(dynamodbMock).toHaveReceivedNthCommandWith(
              1,
              PutItemCommand,
              {
                Item: expect.objectContaining({
                  abn: { S: expect.any(String) },
                  decryptionKey: {
                    S: expect.any(String),
                  },
                  id: { S: expect.any(String) },
                  isRevoked: { BOOL: false },
                  s3Path: {
                    S: expect.any(String),
                  },
                }),
              }
            );
            expect(res.body.errors[0].detail).toContain(
              'An internal system error has occurred.'
            );
          });
      });

      it('should return an error if authorization header is missing', async () => {
        await request(app)
          .post(endpoint)
          .send({
            credential: oa_doc,
          })
          .expect('Content-Type', /json/)
          .expect(500)
          .expect((res) => {
            expect(res.body.errors[0].id).toContain('DVPAPI-003');
          });
      });

      it('should return an error if sub id is missing from the access token payload', async () => {
        await request(app)
          .post(endpoint)
          .set('Authorization', authTokenWithoutSub)
          .send({
            credential: oa_doc,
          })
          .expect('Content-Type', /json/)
          .expect(500)
          .expect((res) => {
            expect(res.body.errors[0].id).toContain('DVPAPI-003');
          });
      });
    });
  });
});
