import {
  CreateKeyPairRequest,
  CreateKeyPairResponse,
  GetKeyPairResponse,
  ListKeyPairResponse,
} from '@dvp/api-client';
import {
  ApplicationError,
  BadRequestError,
  getEpochTimeStamp,
  getUuId,
  kms,
  Logger,
  NotFoundError,
  RequestInvocationContext,
} from '@dvp/server-common';
import crypto, { KeyObject } from 'crypto';
import util from 'util';
import { config } from '../../config';
import { models } from '../../db';
const generateKeyPair = util.promisify(crypto.generateKeyPair);

export class KeyPairService {
  logger: Logger;
  invocationContext: RequestInvocationContext;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
  }

  async createKeyPair(
    payload: CreateKeyPairRequest
  ): Promise<CreateKeyPairResponse> {
    this.logger.info(
      '[KeyPairService.createKeyPair] creating public/private key pair ....'
    );
    const keyPairId = getUuId();
    const { privateKey, publicKey } = await this._createKeyPair();

    this.logger.info(
      '[KeyPairService.createKeyPair] encrypting private key using kms'
    );

    let encryptedPrivateKey: ArrayBuffer | undefined;
    try {
      encryptedPrivateKey = await kms.encrypt({
        encryptionContext: {
          abn: this.invocationContext.userAbn,
        },
        keyId: config.kms.keyId,
        kMSClientConfig: config.kms.clientConfig,
        data: Buffer.from(JSON.stringify(privateKey)),
      });
      this.logger.info(
        '[KeyPairService.createKeyPair] successfully encrypted the private key using kms'
      );
    } catch (err) {
      this.logger.error('Error encrypting the private key with kms, %s', err);
      throw new ApplicationError('Error creating the keypair');
    }

    try {
      await models.KeyPair.create({
        keyId: keyPairId,
        encryptedPrivateKey,
        abn: this.invocationContext.userAbn,
        kmsId: config.kms.keyId,
        publicKey: JSON.stringify(publicKey),
        createdBy: this.invocationContext.userId,
        name: payload.name,
        disabled: false,
      });

      return {
        keyId: keyPairId,
        publicKey: JSON.stringify(publicKey),
        name: payload.name,
      };
    } catch (err) {
      this.logger.error(
        '[KeyPairService.createKeyPair] Error creating the key pair, %s',
        err
      );
      if (err.code === 'UniqueError') {
        throw new BadRequestError(new Error('name should be unique'));
      }
      throw new ApplicationError('Error creating the keypair');
    }
  }

  async listKeyPairs(includeDisabled?: boolean): Promise<ListKeyPairResponse> {
    this.logger.info('[KeyPairService.listKeyPairs] ....');

    try {
      const keyPairs = await models.KeyPair.find(
        {
          pk: `Abn#${this.invocationContext.userAbn}`,
          sk: { begins: 'KeyPair#' },
        },
        {
          ...(!includeDisabled
            ? {
                where: '(${deleted} = {false}) and (${disabled} = {false})',
              }
            : {
                where: '${deleted} = {false}',
              }),
          fields: ['keyId', 'name'],
        }
      );

      const results = keyPairs?.map((keyPair) => ({
        keyId: keyPair.keyId,
        name: keyPair.name,
      }));
      return { results };
    } catch (err) {
      this.logger.error(
        '[KeyPairService.listKeyPairs] Error fetching the keypairs, %s',
        err
      );
      throw new ApplicationError('Error fetching the keypairs');
    }
  }

  async getKeyPair(keyId: string): Promise<GetKeyPairResponse> {
    this.logger.info('[KeyPairService.getKeyPair] retrieving public key');

    try {
      const keyPair = await models.KeyPair.get(
        {
          keyId,
          abn: this.invocationContext.userAbn,
        },
        {
          where: '${deleted} = {false}',
          fields: ['keyId', 'name', 'publicKey', 'disabled'],
        }
      );
      if (!keyPair) {
        throw new NotFoundError(keyId);
      }

      return {
        keyId,
        name: keyPair.name,
        publickey: keyPair.publicKey,
        disabled: keyPair.disabled,
      };
    } catch (err) {
      this.logger.error(
        '[KeyPairService.getKeyPair] Error getting the keypair, %s, %s',
        keyId,
        err
      );
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError('Error getting the keypair');
    }
  }

  async disableKeyPair(keyId: string): Promise<void> {
    this.logger.info(
      '[KeyPairService.disableKeyPair] disabling public/private key pair ....'
    );

    await this._assertKeyPairExist(keyId);

    try {
      await models.KeyPair.update({
        keyId,
        abn: this.invocationContext.userAbn,
        disabled: true,
        updatedBy: this.invocationContext.userId,
      });
      return;
    } catch (err) {
      this.logger.error(
        '[KeyPairService.disableKeyPair] Error disabling the keypair,%s, %s',
        keyId,
        err
      );
      throw new ApplicationError('Error disabling the keypair');
    }
  }

  async deleteKeyPair(keyId: string): Promise<void> {
    this.logger.info(
      '[KeyPairService.deleteKeyPair] deleting public/private key pair ....'
    );

    const keyPair = await this._assertKeyPairExist(keyId);

    if (!keyPair?.disabled) {
      throw new BadRequestError(
        new Error('Not allowed to delete a keypair before disabling it')
      );
    }
    try {
      await models.KeyPair.update({
        keyId,
        abn: this.invocationContext.userAbn,
        deleted: true,
        updatedBy: this.invocationContext.userId,
        ttl: getEpochTimeStamp(),
      });
      return;
    } catch (err) {
      this.logger.error(
        '[KeyPairService.deleteKeyPair] Error deleting the keypair,%s, %s',
        keyId,
        err
      );
      throw new ApplicationError('Error deleting the keypair');
    }
  }

  async _assertKeyPairExist(keyId: string) {
    this.logger.info(
      '[KeyPairService._assertKeyPairExist] check if public/private key pair exist....'
    );
    const keyPair = await models.KeyPair.get(
      {
        keyId,
        abn: this.invocationContext.userAbn,
      },
      {
        where: '${deleted} = {false}',
        fields: ['keyId', 'name', 'disabled', 'deleted'],
      }
    );
    if (!keyPair) {
      throw new NotFoundError(keyId);
    }
    return keyPair;
  }

  _getKeyDeletionGracePeriod() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return getEpochTimeStamp(date);
  }

  /**
   *
   * Generates a new asymmetric key pair of the given type.
   * If a publicKeyEncoding or privateKeyEncoding was specified, this function behaves as if keyObject.export() had been called on its result. Otherwise, the respective part of the key is returned as a KeyObject.
   * It is recommended to encode public keys as 'spki' and private keys as'pkcs8' with encryption for long-term storage:
   *
   * @returns {publicKey, privateKey}
   */
  _createKeyPair = async (): Promise<{
    publicKey: KeyObject;
    privateKey: KeyObject;
  }> => {
    const keys = await generateKeyPair('ed25519', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'jwk',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'jwk',
      },
    });
    return {
      privateKey: keys.privateKey,
      publicKey: keys.publicKey,
    };
  };

  /**
   * [IMPORTANT] : This function returns the private key in plain text, it shouldn't be exposed to the client
   * returns a decrypted private key
   * @param keyId
   * @returns privateKey in plain test
   */
  _getPrivateKey = async (keyId: string): Promise<KeyObject> => {
    const keyPair = await models.KeyPair.get(
      {
        keyId,
        abn: this.invocationContext.userAbn,
      },
      {
        fields: ['privateKey'],
      }
    );

    if (!keyPair) {
      throw Error('Key not found');
    }
    const privateKey = await kms.decrypt({
      encryptionContext: {
        abn: this.invocationContext.userAbn,
      },
      keyId: config.kms.keyId,
      kMSClientConfig: config.kms.clientConfig,
      encryptedData: new Uint8Array(keyPair.encryptedPrivateKey),
    });
    return JSON.parse(privateKey) as KeyObject;
  };
}
