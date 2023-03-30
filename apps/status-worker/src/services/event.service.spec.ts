import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Logger } from '@dvp/server-common';
import { decodeList } from '@transmute/vc-status-rl-2020';
import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import RevocationListRevoked from '../fixtures/genericvc/revocation_list_revoked.json';
import RevocationListUnrevoked from '../fixtures/genericvc/revocation_list_unrevoked.json';
import { EventService } from './event.service';

const getRevocationBitLitArray = (encodedList: string) => {
  return decodeList({ encodedList });
};
const s3Mock = mockClient(S3Client);
const dynamodbMock = mockClient(DynamoDBClient);

const eventService = new EventService(Logger.from());

describe('EventService', () => {
  jest.setTimeout(20000);

  beforeEach(() => {
    s3Mock.reset();
    dynamodbMock.reset();
  });

  describe('SVIP', () => {
    it('should revoke a verifiable credential', async () => {
      const revokeVCMessagePayload = {
        Records: [
          {
            body: JSON.stringify({
              documentId: '0062f9ed-1816-4cde-9d30-e0d19e428dec',
              credentialStatus: [
                {
                  type: 'RevocationList2020Status',
                  status: '1',
                },
              ],
              invocationContext: {
                userAbn: '00000000000',
              },
            }),
          },
        ],
      };

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

      dynamodbMock.on(UpdateItemCommand).resolves({});

      await eventService.handle(revokeVCMessagePayload as SQSEvent);

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

      expect(dynamodbMock).toHaveReceivedNthCommandWith(2, UpdateItemCommand, {
        ExpressionAttributeValues: expect.objectContaining({
          ':_0': { S: '0062f9ed-1816-4cde-9d30-e0d19e428dec' },
          ':_1': { S: '00000000000' },
          ':_2': { BOOL: true }, // Revoked
        }),
      });

      expect(dynamodbMock).toHaveReceivedNthCommandWith(3, UpdateItemCommand, {
        ExpressionAttributeValues: expect.objectContaining({
          ':_0': { S: '0062f9ed-1816-4cde-9d30-e0d19e428dec' },
          ':_1': { S: '00000000000' },
          ':_2': { BOOL: false }, // Revocation NOT in progress
        }),
      });
    }, 20000);

    it('should unrevoke a verifiable credential', async () => {
      const revokeVCMessagePayload = {
        Records: [
          {
            body: JSON.stringify({
              documentId: '0062f9ed-1816-4cde-9d30-e0d19e428dec',
              credentialStatus: [
                {
                  type: 'RevocationList2020Status',
                  status: '0',
                },
              ],
              invocationContext: {
                userAbn: '00000000000',
              },
            }),
          },
        ],
      };

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

      dynamodbMock.on(UpdateItemCommand).resolves({});

      await eventService.handle(revokeVCMessagePayload as SQSEvent);

      // The updated revocation list that is stored back in S3
      const updatedRevocationList = JSON.parse(
        s3Mock.calls()[1].firstArg.input.Body as string
      );

      const list = await getRevocationBitLitArray(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        updatedRevocationList.credentialSubject.encodedList
      );

      // Revocation List index 0 has value 0 (unrevoked)
      expect(list.bitstring.bits[0]).toStrictEqual(0);

      expect(dynamodbMock).toHaveReceivedNthCommandWith(2, UpdateItemCommand, {
        ExpressionAttributeValues: expect.objectContaining({
          ':_0': { S: '0062f9ed-1816-4cde-9d30-e0d19e428dec' },
          ':_1': { S: '00000000000' },
          ':_2': { BOOL: false }, // Unrevoked
        }),
      });

      expect(dynamodbMock).toHaveReceivedNthCommandWith(3, UpdateItemCommand, {
        ExpressionAttributeValues: expect.objectContaining({
          ':_0': { S: '0062f9ed-1816-4cde-9d30-e0d19e428dec' },
          ':_1': { S: '00000000000' },
          ':_2': { BOOL: false }, // Revocaton NOT in progress
        }),
      });
    });

    it.skip('should revert to old revocationList VC if fails to update database', async () => {
      const revokeVCMessagePayload = {
        Records: [
          {
            body: JSON.stringify({
              documentId: '0062f9ed-1816-4cde-9d30-e0d19e428dec',
              credentialStatus: [
                {
                  type: 'RevocationList2020Status',
                  status: '1',
                },
              ],
              invocationContext: {
                userAbn: '00000000000',
              },
            }),
          },
        ],
      };

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
      // dynamodbMock.on(UpdateItemCommand).rejectsOnce({});
      dynamodbMock.on(UpdateItemCommand).resolvesOnce({});

      // Reupload old revocationList VC
      s3Mock.on(PutObjectCommand).resolvesOnce({});

      // Set revocationInProgress to false
      dynamodbMock.on(UpdateItemCommand).resolvesOnce({});

      await eventService.handle(revokeVCMessagePayload as SQSEvent);

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
    it('should revoke a verifiable credential', async () => {
      const revokeVCMessagePayload = {
        Records: [
          {
            body: JSON.stringify({
              documentId: '0062f9ed-1816-4cde-9d30-e0d19e428dec',
              credentialStatus: [
                {
                  type: 'OpenAttestationOCSP',
                  status: '1',
                },
              ],
              invocationContext: {
                userAbn: '00000000000',
              },
            }),
          },
        ],
      };

      dynamodbMock.on(GetItemCommand).resolvesOnce({
        Item: {
          signingMethod: { S: 'OA' },
        },
      });

      dynamodbMock.on(UpdateItemCommand).resolves({});

      await eventService.handle(revokeVCMessagePayload as SQSEvent);

      expect(dynamodbMock).toHaveReceivedNthCommandWith(2, UpdateItemCommand, {
        ExpressionAttributeValues: expect.objectContaining({
          ':_0': { S: '0062f9ed-1816-4cde-9d30-e0d19e428dec' },
          ':_1': { S: '00000000000' },
          ':_2': { BOOL: true }, // Revoked
        }),
      });

      expect(dynamodbMock).toHaveReceivedNthCommandWith(3, UpdateItemCommand, {
        ExpressionAttributeValues: expect.objectContaining({
          ':_0': { S: '0062f9ed-1816-4cde-9d30-e0d19e428dec' },
          ':_1': { S: '00000000000' },
          ':_2': { BOOL: false }, // Revocaton NOT in progress
        }),
      });
    });

    it('should unrevoke a verifiable credential', async () => {
      const revokeVCMessagePayload = {
        Records: [
          {
            body: JSON.stringify({
              documentId: '0062f9ed-1816-4cde-9d30-e0d19e428dec',
              credentialStatus: [
                {
                  type: 'OpenAttestationOCSP',
                  status: '0',
                },
              ],
              invocationContext: {
                userAbn: '00000000000',
              },
            }),
          },
        ],
      };

      dynamodbMock.on(GetItemCommand).resolvesOnce({
        Item: {
          signingMethod: { S: 'OA' },
        },
      });

      dynamodbMock.on(UpdateItemCommand).resolves({});

      await eventService.handle(revokeVCMessagePayload as SQSEvent);

      expect(dynamodbMock).toHaveReceivedNthCommandWith(2, UpdateItemCommand, {
        ExpressionAttributeValues: expect.objectContaining({
          ':_0': { S: '0062f9ed-1816-4cde-9d30-e0d19e428dec' },
          ':_1': { S: '00000000000' },
          ':_2': { BOOL: false }, // Unrevoked
        }),
      });

      expect(dynamodbMock).toHaveReceivedNthCommandWith(3, UpdateItemCommand, {
        ExpressionAttributeValues: expect.objectContaining({
          ':_0': { S: '0062f9ed-1816-4cde-9d30-e0d19e428dec' },
          ':_1': { S: '00000000000' },
          ':_2': { BOOL: false }, // Revocaton NOT in progress
        }),
      });
    });
  });
});
