import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import request from 'supertest';
import { app } from '../../app';
import RevocationListRevoked from '../../fixtures/genericvc/revocation_list_revoked.json';
import RevocationListUnrevoked from '../../fixtures/genericvc/revocation_list_unrevoked.json';

import { getRevocationBitLitArray } from '../../routes/credentials/status/status.service.spec';
import { authTokenWithSubAndAbn } from './utils';

const s3Mock = mockClient(S3Client);
const dynamodbMock = mockClient(DynamoDBClient);

const revokePayload = {
  credentialId: '0062f9ed-1816-4cde-9d30-e0d19e428dec',
  credentialStatus: [
    {
      type: 'RevocationList2020Status',
      status: '1',
    },
  ],
};

const unrevokePayload = {
  credentialId: '0062f9ed-1816-4cde-9d30-e0d19e428dec',
  credentialStatus: [
    {
      type: 'RevocationList2020Status',
      status: '0',
    },
  ],
};

const oaRevokePayload = {
  credentialId: '0062f9ed-1816-4cde-9d30-e0d19e428dec',
  credentialStatus: [
    {
      type: 'OpenAttestationOCSP',
      status: '1',
    },
  ],
};

const oaUnrevokePayload = {
  credentialId: '0062f9ed-1816-4cde-9d30-e0d19e428dec',
  credentialStatus: [
    {
      type: 'OpenAttestationOCSP',
      status: '0',
    },
  ],
};

describe('status api', () => {
  jest.setTimeout(20000);
  const endpoint = '/v1/credentials/status';

  beforeEach(() => {
    s3Mock.reset();
    dynamodbMock.reset();
  });

  describe('GET /v1/status/oa-ocsp/:documentHash', () => {
    it('should return the correct response for an unrevoked OA VC', async () => {
      dynamodbMock.on(QueryCommand).resolvesOnce({
        Items: [
          {
            isRevoked: { BOOL: false },
          },
        ],
      });

      await request(app)
        .get(`${endpoint}/oa-ocsp/oa-document-hash`)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect(200)
        .expect((res) =>
          expect(res.body).toStrictEqual({
            documentHash: 'oa-document-hash',
            revoked: false,
          })
        );
    });

    it('should return error if the documentHash does not exist', async () => {
      dynamodbMock.on(QueryCommand).resolvesOnce({
        Items: [],
      });

      await request(app)
        .get(`${endpoint}/oa-ocsp/oa-document-hash`)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect(404)
        .expect((res) =>
          expect(res.body.errors).toStrictEqual([
            expect.objectContaining({
              code: 'NotFound',
              detail: 'Could not find [oa-document-hash].',
            }),
          ])
        );
    });
  });

  describe('GET /v1/status/revocation-list-2020/:listId', () => {
    it('should return the revocation list VC with the specified listId', async () => {
      s3Mock.on(GetObjectCommand).resolvesOnce({
        Body: {
          transformToString: () => {
            return JSON.stringify(RevocationListUnrevoked);
          },
        } as any,
      });

      await request(app)
        .get(`${endpoint}/revocation-list-2020/1`)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect(200)
        .expect((res) =>
          expect(res.body).toStrictEqual(RevocationListUnrevoked)
        );
    });

    it('should return error if the revocation list vc with the specified statusId does not exist', async () => {
      s3Mock.on(HeadObjectCommand).rejectsOnce({});

      await request(app)
        .get(`${endpoint}/revocation-list-2020/1`)
        .set({ Authorization: authTokenWithSubAndAbn })
        .expect(404)
        .expect((res) => {
          expect(res.body).toMatchObject({
            errors: expect.arrayContaining([
              expect.objectContaining({
                id: 'DVPAPI-004',
                code: 'NotFound',
                detail: 'Could not find [1].',
              }),
            ]),
          });
        });
    });
  });

  describe('POST /v1/status', () => {
    describe('SVIP', () => {
      it('should revoke a verifiable credential ', async () => {
        dynamodbMock.on(GetItemCommand).resolvesOnce({
          Item: {
            revocationIndex: { N: '0' },
            revocationS3Path: { S: '1' },
            signingMethod: { S: 'SVIP' },
          },
        });

        s3Mock.on(GetObjectCommand).resolvesOnce({
          Body: {
            transformToString: () => {
              return JSON.stringify(RevocationListUnrevoked);
            },
          } as any,
        });
        s3Mock.on(PutObjectCommand).resolvesOnce({});

        dynamodbMock.on(UpdateItemCommand).resolvesOnce({});

        await request(app)
          .post(endpoint)
          .send(revokePayload)
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect(200);

        // The updated revocation list that is stored back in S3
        const updatedRevocationList = JSON.parse(
          s3Mock.calls()[1].firstArg.input.Body as string
        );

        const list = await getRevocationBitLitArray(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          updatedRevocationList.credentialSubject.encodedList
        );

        // Revocation List index 0 has value 1 (revoked)
        expect(list.bitstring.bits[0]).toStrictEqual(1);

        expect(dynamodbMock).toHaveReceivedNthCommandWith(
          2,
          UpdateItemCommand,
          {
            ExpressionAttributeValues: expect.objectContaining({
              ':_0': { S: '0062f9ed-1816-4cde-9d30-e0d19e428dec' },
              ':_1': { S: '00000000000' },
              ':_2': { BOOL: true }, // Revoked
            }),
          }
        );
      });
      it('should unrevoke a verifiable credential ', async () => {
        dynamodbMock.on(GetItemCommand).resolvesOnce({
          Item: {
            revocationIndex: { N: '0' },
            revocationS3Path: { S: '1' },
            signingMethod: { S: 'SVIP' },
          },
        });

        s3Mock.on(GetObjectCommand).resolvesOnce({
          Body: {
            transformToString: () => {
              return JSON.stringify(RevocationListRevoked);
            },
          } as any,
        });
        s3Mock.on(PutObjectCommand).resolvesOnce({});

        dynamodbMock.on(UpdateItemCommand).resolvesOnce({});

        await request(app)
          .post(endpoint)
          .send(unrevokePayload)
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect(200);

        // The updated revocation list that is stored back in S3
        const updatedRevocationList = JSON.parse(
          s3Mock.calls()[1].firstArg.input.Body as string
        );

        const list = await getRevocationBitLitArray(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          updatedRevocationList.credentialSubject.encodedList
        );

        // Revocation List index 0 has value 1 (revoked)
        expect(list.bitstring.bits[0]).toStrictEqual(0);

        expect(dynamodbMock).toHaveReceivedNthCommandWith(
          2,
          UpdateItemCommand,
          {
            ExpressionAttributeValues: expect.objectContaining({
              ':_0': { S: '0062f9ed-1816-4cde-9d30-e0d19e428dec' },
              ':_1': { S: '00000000000' },
              ':_2': { BOOL: false }, // Not revoked
            }),
          }
        );
      });
      it('should revert to old revocationList VC if fails to update database', async () => {
        dynamodbMock.on(GetItemCommand).resolvesOnce({
          Item: {
            revocationIndex: { N: '0' },
            revocationS3Path: { S: '1' },
            signingMethod: { S: 'SVIP' },
          },
        });

        s3Mock.on(GetObjectCommand).resolvesOnce({
          Body: {
            transformToString: () => {
              return JSON.stringify(RevocationListUnrevoked);
            },
          } as any,
        });
        s3Mock.on(PutObjectCommand).resolvesOnce({});

        // DB update fails
        dynamodbMock.on(UpdateItemCommand).rejectsOnce({});

        // Reupload old revocationList VC
        s3Mock.on(PutObjectCommand).resolvesOnce({});

        await request(app)
          .post(endpoint)
          .send(revokePayload)
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect(500)
          .expect((res) => {
            expect(res.body).toMatchObject({
              errors: expect.arrayContaining([
                expect.objectContaining({
                  id: 'DVPAPI-001',
                  code: 'SystemError',
                  detail: 'An internal system error has occurred.',
                }),
              ]),
            });
          });

        // The updated revocation list that is stored back in S3
        const updatedRevocationList = JSON.parse(
          s3Mock.calls()[1].firstArg.input.Body as string
        );

        const list = await getRevocationBitLitArray(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          updatedRevocationList.credentialSubject.encodedList
        );

        // Revocation List index 0 has value 1 (revoked)
        expect(list.bitstring.bits[0]).toStrictEqual(1);

        // Reupload old revocationList VC since database failed to update
        expect(s3Mock).toHaveReceivedNthCommandWith(3, PutObjectCommand, {
          Body: JSON.stringify(RevocationListUnrevoked),
        });
      });
    });
    describe('OA', () => {
      it('should revoke a verifiable credential ', async () => {
        dynamodbMock.on(GetItemCommand).resolvesOnce({
          Item: {
            revocationIndex: { N: '0' },
            revocationS3Path: { S: '1' },
            signingMethod: { S: 'OA' },
          },
        });

        dynamodbMock.on(UpdateItemCommand).resolvesOnce({});

        await request(app)
          .post(endpoint)
          .send(oaRevokePayload)
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect(200);

        expect(dynamodbMock).toHaveReceivedNthCommandWith(
          2,
          UpdateItemCommand,
          {
            ExpressionAttributeValues: expect.objectContaining({
              ':_0': { S: '0062f9ed-1816-4cde-9d30-e0d19e428dec' },
              ':_1': { S: '00000000000' },
              ':_2': { BOOL: true }, // Revoked
            }),
          }
        );
      });
      it('should unrevoke a verifiable credential ', async () => {
        dynamodbMock.on(GetItemCommand).resolvesOnce({
          Item: {
            revocationIndex: { N: '0' },
            revocationS3Path: { S: '1' },
            signingMethod: { S: 'OA' },
          },
        });

        dynamodbMock.on(UpdateItemCommand).resolvesOnce({});

        await request(app)
          .post(endpoint)
          .send(oaUnrevokePayload)
          .set({ Authorization: authTokenWithSubAndAbn })
          .expect(200);

        expect(dynamodbMock).toHaveReceivedNthCommandWith(
          2,
          UpdateItemCommand,
          {
            ExpressionAttributeValues: expect.objectContaining({
              ':_0': { S: '0062f9ed-1816-4cde-9d30-e0d19e428dec' },
              ':_1': { S: '00000000000' },
              ':_2': { BOOL: false }, // Not revoked
            }),
          }
        );
      });
    });
    describe('errors', () => {
      describe('system', () => {
        it('should return system error if failed to set status', async () => {
          dynamodbMock.on(GetItemCommand).rejectsOnce({});

          await request(app)
            .post(endpoint)
            .send(unrevokePayload)
            .set({ Authorization: authTokenWithSubAndAbn })
            .expect(500)
            .expect((res) => {
              expect(res.body).toMatchObject({
                errors: expect.arrayContaining([
                  expect.objectContaining({
                    id: 'DVPAPI-001',
                    code: 'SystemError',
                    detail: 'An internal system error has occurred.',
                  }),
                ]),
              });
            });
        });
      });

      describe('validation', () => {
        it('should return validation error if credentialId is missing', async () => {
          await request(app)
            .post(endpoint)
            .send({})
            .set({ Authorization: authTokenWithSubAndAbn })
            .expect(400)
            .expect((res) => {
              expect(res.body).toMatchObject({
                errors: expect.arrayContaining([
                  {
                    id: 'DVPAPI-002',
                    code: 'ValidationError',
                    detail:
                      "/body/credentialId: must have required property 'credentialId'",
                  },
                ]),
              });
            });
        });

        it('should return validation error if credentialId is not of type string', async () => {
          await request(app)
            .post(endpoint)
            .send({
              credentialId: 1,
            })
            .set({ Authorization: authTokenWithSubAndAbn })
            .expect(400)
            .expect((res) => {
              expect(res.body).toMatchObject({
                errors: expect.arrayContaining([
                  {
                    id: 'DVPAPI-002',
                    code: 'ValidationError',
                    detail: '/body/credentialId: must be string',
                  },
                ]),
              });
            });
        });

        it('should return validation error if credentialStatus is missing', async () => {
          await request(app)
            .post(endpoint)
            .send({})
            .set({ Authorization: authTokenWithSubAndAbn })
            .expect(400)
            .expect((res) => {
              expect(res.body).toMatchObject({
                errors: expect.arrayContaining([
                  {
                    id: 'DVPAPI-002',
                    code: 'ValidationError',
                    detail:
                      "/body/credentialStatus: must have required property 'credentialStatus'",
                  },
                ]),
              });
            });
        });

        it('should return validation error if credentialStatus is an empty array', async () => {
          await request(app)
            .post(endpoint)
            .send({ credentialStatus: [] })
            .set({ Authorization: authTokenWithSubAndAbn })
            .expect(400)
            .expect((res) => {
              expect(res.body).toMatchObject({
                errors: expect.arrayContaining([
                  {
                    id: 'DVPAPI-002',
                    code: 'ValidationError',
                    detail:
                      '/body/credentialStatus: must NOT have fewer than 1 items',
                  },
                ]),
              });
            });
        });

        it('should return validation error if credentialStatus does not contain type and status', async () => {
          await request(app)
            .post(endpoint)
            .send({ credentialStatus: [{}] })
            .set({ Authorization: authTokenWithSubAndAbn })
            .expect(400)
            .expect((res) => {
              expect(res.body).toMatchObject({
                errors: expect.arrayContaining([
                  {
                    id: 'DVPAPI-002',
                    code: 'ValidationError',
                    detail:
                      "/body/credentialStatus/0/type: must have required property 'type'",
                  },
                  {
                    id: 'DVPAPI-002',
                    code: 'ValidationError',
                    detail:
                      "/body/credentialStatus/0/status: must have required property 'status'",
                  },
                ]),
              });
            });
        });
      });
    });
  });
});
