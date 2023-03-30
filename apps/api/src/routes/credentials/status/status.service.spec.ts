import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { CredentialStatus } from '@dvp/api-client';
import { RequestInvocationContext } from '@dvp/server-common';
import { getMockReq } from '@jest-mock/express';
import { decodeList } from '@transmute/vc-status-rl-2020';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import RevocationListRevoked from '../../../fixtures/genericvc/revocation_list_revoked.json';
import RevocationListUnrevoked from '../../../fixtures/genericvc/revocation_list_unrevoked.json';
import { authTokenWithSubAndAbn } from '../../../tests/integration/utils';
import { StatusService } from './status.service';

const dynamodbMock = mockClient(DynamoDBClient);
const s3Mock = mockClient(S3Client);

export const getRevocationBitLitArray = (encodedList: string) => {
  return decodeList({ encodedList });
};

describe('status.service', () => {
  jest.setTimeout(20000);

  const mockRequest = getMockReq({
    method: 'POST',
    headers: {
      'Correlation-ID': 'NUMPTYHEAD1',
    },
    header: jest.fn().mockImplementation(() => authTokenWithSubAndAbn),
  });

  mockRequest.route = { path: '/credentials/status' };
  const invocationContext = new RequestInvocationContext(mockRequest);
  const statusService = new StatusService(invocationContext);

  beforeEach(() => {
    s3Mock.reset();
    dynamodbMock.reset();
  });

  describe('SVIP', () => {
    describe('generateListUrl', () => {
      it('should correctly generate a list url', () => {
        expect(statusService.generateListUrl(8888)).toStrictEqual(
          'api/credentials/status/revocation-list-2020/8888'
        );
      });
    });

    describe('createRevocationList', () => {
      it('should create a revocation list verifiable credential', async () => {
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        s3Mock.on(PutObjectCommand).resolvesOnce({});

        const revocationList = await statusService.createRevocationListVC(2, 1);

        expect(revocationList).toEqual(
          expect.objectContaining({
            id: 'api/credentials/status/revocation-list-2020/1',
            credentialSubject: {
              id: 'api/credentials/status/revocation-list-2020/1#list',
              type: 'RevocationList2020',
              encodedList: 'H4sIAAAAAAAAA2MAAI3vAtIBAAAA',
            },
          })
        );
      });

      it('should throw error if failed to create revocation list verifiable credential', async () => {
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        s3Mock.on(PutObjectCommand).rejectsOnce({});

        await expect(
          statusService.createRevocationListVC(2, 1)
        ).rejects.toThrow('Failed to create revocation list');
      });
    });

    describe('setRevocationStatus', () => {
      const credentialPayload = {
        credentialId: 'fcb91d37-1e6c-49d0-91e7-d296bd1beb5d',
        credentialStatus: [
          {
            type: 'RevocationList2020Status',
            status: '1',
          },
        ],
      };

      it('should revoke a verifiable credential by setting status to 1', async () => {
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

        let list = await getRevocationBitLitArray(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          RevocationListUnrevoked.credentialSubject.encodedList
        );

        //   Revocation List index 0 has value 0 (Not revoked)
        expect(list.bitstring.bits[0]).toStrictEqual(0);

        const updatedList = await statusService.setRevocationStatus(
          credentialPayload.credentialId,
          credentialPayload.credentialStatus as CredentialStatus[]
        );

        list = await getRevocationBitLitArray(
          updatedList.credentialSubject.encodedList
        );

        // Revocation List index 0 has value 1 (revoked)
        expect(list.bitstring.bits[0]).toStrictEqual(1);

        // New Revocation List uploaded to s3
        expect(s3Mock).toHaveReceivedNthCommandWith(2, PutObjectCommand, {
          // The old revocationList
          Body: JSON.stringify(updatedList),
        });

        // Update vc entry in dynamodb
        expect(dynamodbMock).toHaveReceivedNthCommandWith(
          2,
          UpdateItemCommand,
          {
            ExpressionAttributeValues: expect.objectContaining({
              ':_0': {
                S: 'fcb91d37-1e6c-49d0-91e7-d296bd1beb5d',
              },
              ':_1': { S: '00000000000' },
              ':_2': { BOOL: true }, // VC is revoked
            }),
          }
        );
      });

      it('should unrevoke a verifiable credential by setting status to 0', async () => {
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

        let list = await getRevocationBitLitArray(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          RevocationListRevoked.credentialSubject.encodedList
        );

        //   Revocation List index 0 has value 1 (revoked)
        expect(list.bitstring.bits[0]).toStrictEqual(1);

        const credentialStatusToUnrevoke = {
          ...credentialPayload.credentialStatus[0],
          status: '0',
        };

        const updatedList = await statusService.setRevocationStatus(
          credentialPayload.credentialId,
          [credentialStatusToUnrevoke] as CredentialStatus[]
        );

        list = await getRevocationBitLitArray(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          updatedList.credentialSubject.encodedList
        );

        // Revocation List index 0 has value 0 (Not revoked)
        expect(list.bitstring.bits[0]).toStrictEqual(0);

        // New Revocation List uploaded to s3
        expect(s3Mock).toHaveReceivedNthCommandWith(2, PutObjectCommand, {
          // The old revocationList
          Body: JSON.stringify(updatedList),
        });

        // Update vc entry in dynamodb
        expect(dynamodbMock).toHaveReceivedNthCommandWith(
          2,
          UpdateItemCommand,
          {
            ExpressionAttributeValues: expect.objectContaining({
              ':_0': {
                S: 'fcb91d37-1e6c-49d0-91e7-d296bd1beb5d',
              },
              ':_1': { S: '00000000000' },
              ':_2': { BOOL: false }, // VC is not revoked
            }),
          }
        );
      });

      it('should revert revocationList VC if database update fails', async () => {
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

        dynamodbMock.on(UpdateItemCommand).rejects({});

        // Uploading the old revocationList VC
        s3Mock.on(PutObjectCommand).resolvesOnce({});

        await expect(
          statusService.setRevocationStatus(
            credentialPayload.credentialId,
            credentialPayload.credentialStatus as CredentialStatus[]
          )
        ).rejects.toThrow('Failed to set verification credential status');

        expect(s3Mock).toHaveReceivedNthCommandWith(3, PutObjectCommand, {
          // The old revocationList
          Body: JSON.stringify(RevocationListUnrevoked),
        });
      });

      it('should throw error if VC does not include revocation information', async () => {
        dynamodbMock.on(GetItemCommand).resolvesOnce({
          Item: {},
        });

        await expect(
          statusService.setRevocationStatus(
            credentialPayload.credentialId,
            credentialPayload.credentialStatus as CredentialStatus[]
          )
        ).rejects.toThrow('Failed to set verification credential status');
      });
    });

    describe('updateRevocationListData', () => {
      it('should update revocation counter correctly', async () => {
        dynamodbMock.on(GetItemCommand).resolvesOnce({
          Item: {
            counter: { N: '0' },
            listCounter: { N: '1' },
          },
        });

        dynamodbMock.on(UpdateItemCommand).resolvesOnce({});

        await statusService.updateRevocationListData();

        //   listCounter is still 1
        //   counter is now 1
        expect(dynamodbMock).toHaveReceivedNthCommandWith(
          2,
          UpdateItemCommand,
          {
            ExpressionAttributeValues: expect.objectContaining({
              ':_0': { N: '1' },
              ':_1': { N: '1' },
            }),
          }
        );
      });

      it('should create new revocation list, reset counter and increment listCounter if bit length is reached', async () => {
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        s3Mock.on(PutObjectCommand).resolvesOnce({});

        dynamodbMock.on(GetItemCommand).resolvesOnce({
          Item: {
            counter: { N: '7' },
            listCounter: { N: '1' },
          },
        });

        dynamodbMock.on(UpdateItemCommand).resolvesOnce({});

        await statusService.updateRevocationListData();

        //   listCounter is incremented ot 2
        //   counter is reset to 0
        expect(dynamodbMock).toHaveReceivedNthCommandWith(
          2,
          UpdateItemCommand,
          {
            ExpressionAttributeValues: expect.objectContaining({
              ':_0': { N: '2' },
              ':_1': { N: '0' },
            }),
          }
        );
      });
    });

    describe('getRevocationListData', () => {
      it('should return correct revocation list data', async () => {
        dynamodbMock.on(GetItemCommand).resolvesOnce({
          Item: {
            counter: { N: '1' },
            listCounter: { N: '1' },
            bitStringLength: { N: '8' },
          },
        });

        const revocationListData = await statusService.getRevocationListData();

        expect(revocationListData).toMatchObject({
          index: 1,
          listUrl: 'api/credentials/status/revocation-list-2020/1',
          s3Path: '1',
        });
      });

      it('should create new RevocationCounter entry if one does not exist', async () => {
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        dynamodbMock.on(GetItemCommand).resolves({});
        dynamodbMock.on(UpdateItemCommand).resolvesOnce({
          Attributes: {
            counter: { N: '0' },
            listCounter: { N: '1' },
          },
        });

        const revocationListData = await statusService.getRevocationListData();

        //  Creating new entry with listCounter set to 0 and counter to 1

        expect(dynamodbMock).toHaveReceivedNthCommandWith(
          2,
          UpdateItemCommand,
          {
            ExpressionAttributeValues: expect.objectContaining({
              ':_0': { N: '1' },
              ':_1': { N: '0' },
            }),
          }
        );

        expect(revocationListData).toMatchObject({
          index: 0,
          listUrl: 'api/credentials/status/revocation-list-2020/1',
          s3Path: '1',
        });
      });

      it('should update RevocationCounter entry if bitStringLength has changed', async () => {
        s3Mock.on(HeadObjectCommand).rejectsOnce({});
        s3Mock.on(PutObjectCommand).resolvesOnce({});
        dynamodbMock.on(GetItemCommand).resolves({
          Item: {
            counter: { N: '1' },
            listCounter: { N: '1' },
            bitStringLength: { N: '4' },
          },
        });
        dynamodbMock.on(UpdateItemCommand).resolvesOnce({
          Attributes: {
            counter: { N: '0' },
            listCounter: { N: '2' },
            bitStringLength: { N: '16' },
          },
        });

        const revocationListData = await statusService.getRevocationListData();

        //  Creating new entry with listCounter set to 0 and counter to 1

        expect(dynamodbMock).toHaveReceivedNthCommandWith(
          2,
          UpdateItemCommand,
          {
            ExpressionAttributeValues: expect.objectContaining({
              ':_0': { N: '2' },
              ':_1': { N: '0' },
              ':_2': { N: '8' }, // Changed to 8 since bitStringLength is set to 8 in process.env
            }),
          }
        );

        expect(revocationListData).toMatchObject({
          index: 0,
          listUrl: 'api/credentials/status/revocation-list-2020/2',
          s3Path: '2',
        });
      });

      it('should throw error if failed to get revocation list data', async () => {
        await expect(statusService.getRevocationListData()).rejects.toThrow(
          'Failed to get revocationList data'
        );
      });
    });
  });

  describe('OA', () => {
    const credentialPayload = {
      credentialId: 'fcb91d37-1e6c-49d0-91e7-d296bd1beb5d',
      credentialStatus: [
        {
          type: 'OpenAttestationOCSP',
          status: '1',
        },
      ],
    };

    it('should revoke a verifiable credential by setting status to 1', async () => {
      dynamodbMock.on(GetItemCommand).resolvesOnce({
        Item: {
          signingMethod: { S: 'OA' },
        },
      });

      dynamodbMock.on(UpdateItemCommand).resolvesOnce({});

      await statusService.setRevocationStatus(
        credentialPayload.credentialId,
        credentialPayload.credentialStatus as CredentialStatus[]
      );

      // Update vc entry in dynamodb
      expect(dynamodbMock).toHaveReceivedNthCommandWith(2, UpdateItemCommand, {
        ExpressionAttributeValues: expect.objectContaining({
          ':_0': {
            S: 'fcb91d37-1e6c-49d0-91e7-d296bd1beb5d',
          },
          ':_1': { S: '00000000000' },
          ':_2': { BOOL: true }, // VC is revoked
        }),
      });
    });

    it('should unrevoke a verifiable credential by setting status to 0', async () => {
      dynamodbMock.on(GetItemCommand).resolvesOnce({
        Item: {
          signingMethod: { S: 'OA' },
        },
      });

      dynamodbMock.on(UpdateItemCommand).resolvesOnce({});

      const credentialStatusToUnrevoke = {
        ...credentialPayload.credentialStatus[0],
        status: '0',
      };

      await statusService.setRevocationStatus(credentialPayload.credentialId, [
        credentialStatusToUnrevoke,
      ] as CredentialStatus[]);

      // Update vc entry in dynamodb
      expect(dynamodbMock).toHaveReceivedNthCommandWith(2, UpdateItemCommand, {
        ExpressionAttributeValues: expect.objectContaining({
          ':_0': {
            S: 'fcb91d37-1e6c-49d0-91e7-d296bd1beb5d',
          },
          ':_1': { S: '00000000000' },
          ':_2': { BOOL: false }, // VC is not revoked
        }),
      });
    });
  });

  describe('errors', () => {
    const credentialPayload = {
      credentialId: 'fcb91d37-1e6c-49d0-91e7-d296bd1beb5d',
      credentialStatus: [
        {
          type: 'OpenAttestationOCSP',
          status: '1',
        },
      ],
    };

    it('should throw error if failed to set status', async () => {
      await expect(
        statusService.setRevocationStatus(
          credentialPayload.credentialId,
          credentialPayload.credentialStatus as CredentialStatus[]
        )
      ).rejects.toThrow('Failed to set verification credential status');
    });
  });
});
