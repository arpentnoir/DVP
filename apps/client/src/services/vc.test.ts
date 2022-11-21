import { VerifiableCredential } from '@dvp/api-interfaces';
import { CHAFTA_COO } from '../mocks/fixtures/documents';
import { _getIssuer } from './vc';

describe('_getIssuer', () => {
  it('should return issuer if present in document', () => {
    const issuer = _getIssuer(CHAFTA_COO as VerifiableCredential);

    expect(issuer).toStrictEqual({
      id: 'https://example.com',
      name: 'DEMO DID',
    });
  });

  it('should return empty string if issuer is not present in document', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { issuer, ...withoutIssuer } = CHAFTA_COO;
    const iss = _getIssuer(withoutIssuer as never);

    expect(iss).toStrictEqual({ id: '', name: '' });
  });
});
