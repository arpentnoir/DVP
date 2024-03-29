import {
  DecryptCommand,
  DecryptCommandInput,
  EncryptCommand,
  EncryptCommandInput,
  KMSClient,
  KMSClientConfig,
} from '@aws-sdk/client-kms';

interface CommonParams {
  /**
   * The configuration interface of KMSClient class constructor that set the region, credentials and other options.
   */
  kMSClientConfig: KMSClientConfig;
  /**
   * Specifies the symmetric encryption KMS key that encrypts the private key in the data key pair
   */
  keyId: string;
  /**
   * <p>Specifies the encryption context that will be used when encrypting the private key in the
   *       data key pair.</p>
   *          <p>An <i>encryption context</i> is a collection of non-secret key-value pairs that represent additional authenticated data.
   * When you use an encryption context to encrypt data, you must specify the same (an exact case-sensitive match) encryption context to decrypt the data. An encryption context is supported
   * only on operations with symmetric encryption KMS keys. On operations with symmetric encryption KMS keys, an encryption context is optional, but it is strongly recommended.</p>
   *          <p>For more information, see
   * <a href="https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#encrypt_context">Encryption context</a> in the <i>Key Management Service Developer Guide</i>.</p>
   */
  encryptionContext: {
    abn: string;
  };
}

interface DecryptParams extends CommonParams {
  encryptedData: DecryptCommandInput['CiphertextBlob'];
}

interface EncryptParams extends CommonParams {
  data: EncryptCommandInput['Plaintext'];
}

export const encrypt = async ({
  kMSClientConfig,
  keyId,
  encryptionContext,
  data,
}: EncryptParams): Promise<ArrayBuffer | undefined> => {
  const client = new KMSClient(kMSClientConfig);
  const command = new EncryptCommand({
    KeyId: keyId,
    EncryptionContext: encryptionContext,
    Plaintext: data,
  });
  const response = await client.send(command);
  return response?.CiphertextBlob;
};

export const decrypt = async ({
  kMSClientConfig,
  keyId,
  encryptionContext,
  encryptedData,
}: DecryptParams) => {
  const client = new KMSClient(kMSClientConfig);
  const command = new DecryptCommand({
    KeyId: keyId,
    CiphertextBlob: encryptedData,
    EncryptionContext: encryptionContext,
  });
  const response = await client.send(command);
  return new TextDecoder().decode(response.Plaintext);
};
