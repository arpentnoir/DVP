import { getMockRes } from '@jest-mock/express';
import { getMockRequest } from '../../tests/utils';
import {
  createKeyPair,
  deleteKeyPair,
  disableKeyPair,
  getKeyPair,
  listKeyPairs,
} from './keypair.controller';
import { KeyPairService } from './keypair.service';

const { res: responseMock, next: nextMock } = getMockRes({ send: jest.fn() });

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

describe('keypair.controller', () => {
  describe('createKeyPair', () => {
    const mockRequest = getMockRequest('/api/keypairs', 'POST', {
      name: 'key 1',
    });
    it('should create a key pair', async () => {
      const res = {
        ...keypairs.results[0],
        publicKey: 'text',
      };
      jest
        .spyOn(KeyPairService.prototype, 'createKeyPair')
        .mockResolvedValue(res);

      await createKeyPair(mockRequest, responseMock, nextMock);
      expect(responseMock.json).toBeCalledWith(res);
    });

    it('should return the error through next function', async () => {
      jest
        .spyOn(KeyPairService.prototype, 'createKeyPair')
        .mockRejectedValue(new Error('error'));

      await createKeyPair(mockRequest, responseMock, nextMock);
      expect(nextMock).toBeCalledWith(new Error('error'));
    });
  });

  describe('getKeyPair', () => {
    const keyId = 'key 1';
    const mockRequest = getMockRequest(`/api/keypairs/${keyId}`, 'GET');
    it('should return a keypair', async () => {
      const res = {
        ...keypairs.results[0],
        publicKey: 'text',
      };
      jest.spyOn(KeyPairService.prototype, 'getKeyPair').mockResolvedValue(res);

      await getKeyPair(mockRequest as never, responseMock, nextMock);
      expect(responseMock.json).toHaveBeenCalledWith(res);
    });

    it('should return the error through next function', async () => {
      jest
        .spyOn(KeyPairService.prototype, 'getKeyPair')
        .mockRejectedValue(new Error('error'));

      await getKeyPair(mockRequest as never, responseMock, nextMock);
      expect(nextMock).toHaveBeenCalledWith(new Error('error'));
    });
  });

  describe('listKeyPairs', () => {
    const mockRequest = getMockRequest(`/api/keypairs`, 'GET', null, {
      includeDisabled: true,
    });
    it('should list keypairs', async () => {
      jest
        .spyOn(KeyPairService.prototype, 'listKeyPairs')
        .mockResolvedValue(keypairs);

      await listKeyPairs(mockRequest as never, responseMock, nextMock);
      expect(responseMock.json).toHaveBeenCalledWith(keypairs);
      expect(KeyPairService.prototype.listKeyPairs).toHaveBeenCalledWith(true);
    });

    it('should return the error through next function', async () => {
      jest
        .spyOn(KeyPairService.prototype, 'listKeyPairs')
        .mockRejectedValue(new Error('error'));

      await listKeyPairs(mockRequest as never, responseMock, nextMock);
      expect(nextMock).toHaveBeenCalledWith(new Error('error'));
    });
  });

  describe('deleteKeyPair', () => {
    const keyId = 'key 1';
    const mockRequest = getMockRequest(`/api/keypairs/${keyId}`, 'DELETE');
    it('should delete a keypair', async () => {
      jest
        .spyOn(KeyPairService.prototype, 'deleteKeyPair')
        .mockResolvedValue(null);

      await deleteKeyPair(mockRequest as never, responseMock, nextMock);
      expect(responseMock.end).toHaveBeenCalled();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });

    it('should return the error through next function', async () => {
      jest
        .spyOn(KeyPairService.prototype, 'deleteKeyPair')
        .mockRejectedValue(new Error('error'));

      await deleteKeyPair(mockRequest as never, responseMock, nextMock);
      expect(nextMock).toBeCalledWith(new Error('error'));
    });
  });

  describe('disableKeyPair', () => {
    const keyId = 'key 1';
    const mockRequest = getMockRequest(`/api/keypairs/${keyId}/disable`, 'PUT');
    it('should disable a keypair', async () => {
      jest
        .spyOn(KeyPairService.prototype, 'disableKeyPair')
        .mockResolvedValue(null);

      await disableKeyPair(mockRequest as never, responseMock, nextMock);
      expect(responseMock.end).toHaveBeenCalled();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });

    it('should return the error through next function', async () => {
      jest
        .spyOn(KeyPairService.prototype, 'disableKeyPair')
        .mockRejectedValue(new Error('error'));

      await disableKeyPair(mockRequest as never, responseMock, nextMock);
      expect(nextMock).toBeCalledWith(new Error('error'));
    });
  });
});
