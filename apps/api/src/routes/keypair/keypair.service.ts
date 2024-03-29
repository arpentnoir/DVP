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

/**
 * A service class responsible for handling KeyPair operations.
 */
export class KeyPairService {
  logger: Logger;
  invocationContext: RequestInvocationContext;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
  }

  /**
   * Creates a public/private encryption key pair. Both keys are initially generated by @see {_createKeyPair}, and
   * the private key is then encrypted via KMS. Both keys are stored in DynamoDB.
   * 
   * @param payload Optional parameter. Generated by this function if not supplied.
   * @returns A promise to return a @see {CreateKeyPairResponse} object
   */
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

  
  /**
   * Returns a list a public/private encryption key pairs by querying DynamoDB.
   * 
   * @param includeDisabled Optional parameter indicating if disabled key pairs are to be returned.
   * @returns An array of keyPairIds and names.
   */
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
          fields: ['keyId', 'name', 'created'],
        }
      );

      const results = keyPairs?.map((keyPair) => ({
        keyId: keyPair.keyId,
        name: keyPair.name,
        issueDate: keyPair.created,
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

  /**
   * Gets the public porttions of a given key pair from DynamoDB.
   * 
   * @param keyId The unique id of the key pair to be fetched.
   * @returns A promise to return a @GetKeyPairRespone object containing the keyId, name, public key and disabled flag.
   */
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
          fields: ['keyId', 'name', 'publicKey', 'disabled', 'created'],
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
        issueDate: keyPair.created,
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

  /**
   * Disables a key pair by setting the disabled property when updating the DynamoDB record.
   * 
   * @param keyId The unique id of the key pair to be disabled.
   * @returns A promise to complete processing of the request.
   */
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

   /**
   * Deletes a key pair by setting the deleted property and updating the DynamoDB record. 
   * The key pair must first be disabled.
   * Sets a time to live (TTL) of 30 days from the current date.
   * 
   * @param keyId The unique id of the key pair to be disabled.
   * @returns A promise to complete processing of the request.
   */
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

  /**
   * Determines if a key pair exists in DynamoDB.
   * 
   * @param keyId The unique id of the key pair to be checked.
   * @returns A key pair if one exists, a typed error if not.
   */
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

  /**
   * Calculates a date which is 30 days after the current date. 
   * 
   * @returns A unix epoch timestamp.
   */
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
