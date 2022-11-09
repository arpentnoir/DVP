import { fetchAndDecryptVC } from './storage';
import {
  validQRParams,
  invalidQRParams,
  invalidUrlQRParams,
  invalidKeyQRParams,
} from '../mocks/fixtures/responses';

describe('fetchAndDecryptVC', () => {
  it('should fetch and decrypt VC successfully', async () => {
    const r = await fetchAndDecryptVC(validQRParams);

    expect(r.credentialSubject.iD).toStrictEqual('sdf');
  });

  it('should throw error if params contains invalid query', async () => {
    await expect(() => fetchAndDecryptVC(invalidQRParams)).rejects.toThrow(
      'Unable to fetch and/or decrypt Verifiable Credential'
    );
  });

  it('should throw error if params contains invalid storage uri', async () => {
    await expect(() => fetchAndDecryptVC(invalidUrlQRParams)).rejects.toThrow(
      'Unable to fetch and/or decrypt Verifiable Credential'
    );
  });

  it('should throw error if params contains invalid key', async () => {
    await expect(() => fetchAndDecryptVC(invalidKeyQRParams)).rejects.toThrow(
      'Unable to fetch and/or decrypt Verifiable Credential'
    );
  });
});
