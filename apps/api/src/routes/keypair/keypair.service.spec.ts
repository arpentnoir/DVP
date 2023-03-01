import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  ApplicationError,
  BadRequestError,
  kms,
  NotFoundError,
  RequestInvocationContext,
} from '@dvp/server-common';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { getMockRequest } from '../../tests/utils';
import { KeyPairService } from './keypair.service';

const dynamodbMock = mockClient(DynamoDBClient);

jest.mock('@dvp/server-common', () => {
  const original = jest.requireActual('@dvp/server-common');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...original,
    kms: {
      encrypt: jest.fn(),
      decrypt: jest.fn(),
    },
  };
});

const keypairs = {
  results: [
    {
      keyId: '09436734-d746-4eec-a98f-5e8250867a04',
      name: 'key 1',
    },
    {
      keyId: '26d255c9-a86c-4c06-8d61-719fa72ed755',
      name: 'key 2',
    },
  ],
};

const keyPairsDynamo = [
  {
    pk: {
      S: 'Abn#41161080146',
    },
    sk: {
      S: 'KeyPair#09436734-d746-4eec-a98f-5e8250867a04',
    },
    abn: {
      S: '41161080146',
    },
    disabled: {
      BOOL: false,
    },
    keyId: {
      S: '09436734-d746-4eec-a98f-5e8250867a04',
    },
    name: {
      S: 'key 1',
    },
    publicKey: {
      S: '{"crv":"Ed25519","x":"QZZSLgu3lu7r0T5YJVnK8f6uZeDTJakFZKAH8XqfTv8","kty":"OKP"}',
    },
  },
  {
    pk: {
      S: 'Abn#41161080146',
    },
    sk: {
      S: 'KeyPair#26d255c9-a86c-4c06-8d61-719fa72ed755',
    },
    abn: {
      S: '41161080146',
    },
    disabled: {
      BOOL: false,
    },
    keyId: {
      S: '26d255c9-a86c-4c06-8d61-719fa72ed755',
    },
    name: {
      S: 'key 2',
    },
    publicKey: {
      S: '{"crv":"Ed25519","x":"QZZSLgu3lu7r0T5YJVnK8f6uZeDTJakFZKAH8XqfTv8","kty":"OKP"}',
    },
  },
];

describe('KeyPairService', () => {
  jest.useFakeTimers().setSystemTime(new Date('2023-01-01'));

  beforeEach(() => {
    dynamodbMock.reset();
  });

  describe('createKeyPair', () => {
    const mockRequest = getMockRequest('/api/keypairs', 'POST');
    const invocationContext = new RequestInvocationContext(mockRequest);

    (kms.encrypt as jest.Mock).mockResolvedValue(new Uint8Array([1, 2, 3, 4]));

    it('should create a key pair and store in dynamodb', async () => {
      const keyPairService = new KeyPairService(invocationContext);
      (kms.encrypt as jest.Mock).mockResolvedValue(
        new Uint8Array([1, 2, 3, 4])
      );

      const res = await keyPairService.createKeyPair({
        name: 'test',
      });
      expect(res).toHaveProperty('publicKey');
      expect(res).toHaveProperty('keyId');
      expect(res).toHaveProperty('name');
    });

    it('should throw an error if encryption fails', async () => {
      const keyPairService = new KeyPairService(invocationContext);
      (kms.encrypt as jest.Mock).mockRejectedValueOnce(new Error('fail'));

      await expect(() =>
        keyPairService.createKeyPair({
          name: 'test',
        })
      ).rejects.toThrow(new ApplicationError('Error creating the keypair'));
    });

    it('should throw an error if fails to store the keys in the database', async () => {
      const keyPairService = new KeyPairService(invocationContext);
      (kms.encrypt as jest.Mock).mockResolvedValue(
        new Uint8Array([1, 2, 3, 4])
      );
      dynamodbMock.rejectsOnce('fails');
      await expect(() =>
        keyPairService.createKeyPair({
          name: 'test',
        })
      ).rejects.toThrow(new ApplicationError('Error creating the keypair'));
    });

    it('should throw an error if the name is duplicated', async () => {
      const keyPairService = new KeyPairService(invocationContext);
      (kms.encrypt as jest.Mock).mockResolvedValue(
        new Uint8Array([1, 2, 3, 4])
      );
      const error = new Error('UniqueError');
      error['code'] = 'UniqueError';
      dynamodbMock.rejectsOnce(error);
      await expect(() =>
        keyPairService.createKeyPair({
          name: 'test',
        })
      ).rejects.toThrow(
        new BadRequestError(new Error('name should be unique'))
      );
    });
  });

  describe('listKeyPairs', () => {
    const mockRequest = getMockRequest('/api/keypairs', 'GET');
    const invocationContext = new RequestInvocationContext(mockRequest);
    it('should throw an error if fails to fetch from the database', async () => {
      const keyPairService = new KeyPairService(invocationContext);

      dynamodbMock.rejectsOnce('fails');
      await expect(() => keyPairService.listKeyPairs()).rejects.toThrow(
        new ApplicationError('Error fetching the keypairs')
      );
    });

    it('should list the key pairs for an abn', async () => {
      const keyPairService = new KeyPairService(invocationContext);

      dynamodbMock.on(QueryCommand).resolvesOnce({
        Items: keyPairsDynamo,
      });

      const res = await keyPairService.listKeyPairs();
      expect(dynamodbMock).toHaveReceivedCommandWith(QueryCommand, {
        ConsistentRead: false,
        ExpressionAttributeNames: {
          '#_0': 'deleted',
          '#_1': 'disabled',
          '#_2': 'pk',
          '#_3': 'sk',
          '#_4': 'keyId',
          '#_5': 'name',
        },
        ExpressionAttributeValues: {
          ':_0': { BOOL: false },
          ':_1': { BOOL: false },
          ':_2': { S: 'Abn#00000000000' },
          ':_3': { S: 'KeyPair#' },
        },
        FilterExpression: '(#_0 = :_0) and (#_1 = :_1)',
        KeyConditionExpression: '#_2 = :_2 and begins_with(#_3, :_3)',
        ProjectionExpression: '#_4, #_5',
        ScanIndexForward: true,
        TableName: 'documents',
      });
      expect(res).toMatchObject(keypairs);
    });

    it('should list the key pairs with disabled keys', async () => {
      const keyPairService = new KeyPairService(invocationContext);

      dynamodbMock.on(QueryCommand).resolvesOnce({
        Items: keyPairsDynamo,
      });

      const res = await keyPairService.listKeyPairs(true);
      expect(dynamodbMock).toHaveReceivedCommandWith(QueryCommand, {
        ConsistentRead: false,
        ExpressionAttributeNames: {
          '#_0': 'deleted',
          '#_1': 'pk',
          '#_2': 'sk',
          '#_3': 'keyId',
          '#_4': 'name',
        },
        ExpressionAttributeValues: {
          ':_0': { BOOL: false },
          ':_1': { S: 'Abn#00000000000' },
          ':_2': { S: 'KeyPair#' },
        },
        FilterExpression: '#_0 = :_0',
        KeyConditionExpression: '#_1 = :_1 and begins_with(#_2, :_2)',
        ProjectionExpression: '#_3, #_4',
        ScanIndexForward: true,
        TableName: 'documents',
      });
      expect(res).toMatchObject(keypairs);
    });
  });

  describe('getKeyPair', () => {
    const keyId = keypairs.results[0].keyId;

    const mockRequest = getMockRequest(`/api/keypairs/${keyId}`, 'GET');
    const invocationContext = new RequestInvocationContext(mockRequest);

    it(`should throw 404 key doesn't exist`, async () => {
      const keyPairService = new KeyPairService(invocationContext);

      dynamodbMock.resolvesOnce({});
      await expect(() => keyPairService.getKeyPair(keyId)).rejects.toThrow(
        new NotFoundError(keyId)
      );
    });

    it('should throw an error if fails to fetch from the database', async () => {
      const keyPairService = new KeyPairService(invocationContext);

      dynamodbMock.rejectsOnce('fails');
      await expect(() => keyPairService.getKeyPair(keyId)).rejects.toThrow(
        new ApplicationError('Error getting the keypair')
      );
    });

    it('should get the key pair for an abn', async () => {
      const keyPairService = new KeyPairService(invocationContext);

      dynamodbMock.resolvesOnce({
        Item: keyPairsDynamo[0],
      });

      const res = await keyPairService.getKeyPair(keyId);
      expect(res).toMatchObject(keypairs.results[0]);
    });
  });

  describe('disableKeyPair', () => {
    const keyId = keypairs.results[0].keyId;

    const mockRequest = getMockRequest(`/api/keypairs/${keyId}/disable`, 'PUT');
    const invocationContext = new RequestInvocationContext(mockRequest);

    it(`should throw 404 key doesn't exist`, async () => {
      const keyPairService = new KeyPairService(invocationContext);

      dynamodbMock.resolvesOnce({});

      await expect(() => keyPairService.disableKeyPair(keyId)).rejects.toThrow(
        new NotFoundError(keyId)
      );
    });

    it('should throw an error if fails to disable the key', async () => {
      const keyPairService = new KeyPairService(invocationContext);

      dynamodbMock.on(GetItemCommand).resolvesOnce({
        Item: keyPairsDynamo[0],
      });
      dynamodbMock.on(UpdateItemCommand).rejectsOnce('fails');
      await expect(() => keyPairService.disableKeyPair(keyId)).rejects.toThrow(
        new ApplicationError('Error disabling the keypair')
      );
    });

    it('should disable the key', async () => {
      const keyPairService = new KeyPairService(invocationContext);

      dynamodbMock.on(GetItemCommand).resolvesOnce({
        Item: keyPairsDynamo[0],
      });
      dynamodbMock.on(UpdateItemCommand).resolves({});

      await keyPairService.disableKeyPair(keyId);
      expect(dynamodbMock).toHaveReceivedCommand(UpdateItemCommand);
    });
  });

  describe('deleteKeyPair', () => {
    const keyId = keypairs.results[0].keyId;

    const mockRequest = getMockRequest(`/api/keypairs/${keyId}`, 'DELETE');
    const invocationContext = new RequestInvocationContext(mockRequest);

    it(`should throw 404 key doesn't exist`, async () => {
      const keyPairService = new KeyPairService(invocationContext);

      dynamodbMock.resolvesOnce({});
      await expect(() => keyPairService.deleteKeyPair(keyId)).rejects.toThrow(
        new NotFoundError(keyId)
      );
    });

    it(`should throw 400 key is not disabled`, async () => {
      const keyPairService = new KeyPairService(invocationContext);

      dynamodbMock.resolvesOnce({
        Item: keyPairsDynamo[0],
      });
      await expect(() => keyPairService.deleteKeyPair(keyId)).rejects.toThrow(
        new BadRequestError(
          new Error('Not allowed to delete a keypair before disabling it')
        )
      );
    });

    it('should throw an error if fails to delete the key', async () => {
      const keyPairService = new KeyPairService(invocationContext);

      dynamodbMock.on(GetItemCommand).resolvesOnce({
        Item: {
          ...keyPairsDynamo[0],
          disabled: {
            BOOL: true,
          },
        },
      });
      dynamodbMock.on(UpdateItemCommand).rejectsOnce('fails');
      await expect(() => keyPairService.deleteKeyPair(keyId)).rejects.toThrow(
        new ApplicationError('Error deleting the keypair')
      );
    });

    it('should schedule the keypair for deletion', async () => {
      const keyPairService = new KeyPairService(invocationContext);

      dynamodbMock.on(GetItemCommand).resolvesOnce({
        Item: {
          ...keyPairsDynamo[0],
          disabled: {
            BOOL: true,
          },
        },
      });
      dynamodbMock.on(UpdateItemCommand).resolvesOnce({});

      await keyPairService.deleteKeyPair(keyId);
      expect(dynamodbMock).toHaveReceivedCommandWith(GetItemCommand, {
        ConsistentRead: false,
        ExpressionAttributeNames: {
          '#_0': 'keyId',
          '#_1': 'name',
          '#_2': 'disabled',
          '#_3': 'deleted',
        },
        Key: {
          pk: { S: 'Abn#00000000000' },
          sk: { S: 'KeyPair#09436734-d746-4eec-a98f-5e8250867a04' },
        },
        ProjectionExpression: '#_0, #_1, #_2, #_3',
        TableName: 'documents',
      });
      expect(dynamodbMock).toHaveReceivedCommandWith(UpdateItemCommand, {
        ConditionExpression:
          '(attribute_exists(#_0)) and (attribute_exists(#_1))',
        ExpressionAttributeNames: {
          '#_0': 'pk',
          '#_1': 'sk',
          '#_2': 'abn',
          '#_3': 'keyId',
          '#_4': 'deleted',
          '#_5': 'ttl',
          '#_6': 'updatedBy',
          '#_7': 'updated',
        },
        ExpressionAttributeValues: {
          ':_0': { S: '00000000000' },
          ':_1': { S: '09436734-d746-4eec-a98f-5e8250867a04' },
          ':_2': { BOOL: true },
          ':_3': { N: '1672531200' },
          ':_4': { S: '1234567890' },
          ':_5': { S: '2023-01-01T00:00:00.000Z' },
        },
        Key: {
          pk: { S: 'Abn#00000000000' },
          sk: { S: 'KeyPair#09436734-d746-4eec-a98f-5e8250867a04' },
        },
        ReturnValues: 'ALL_NEW',
        TableName: 'documents',
        UpdateExpression:
          'set #_2 = :_0, #_3 = :_1, #_4 = :_2, #_5 = :_3, #_6 = :_4, #_7 = :_5',
      });
    });
  });
});
