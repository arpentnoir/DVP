import { _getIssuer } from './vc';
import { CHAFTA_COO } from '../mocks/fixtures/documents';

describe('_getIssuer', () => {
  it('should return issuer if present in document', async () => {
    const issuer = _getIssuer(CHAFTA_COO);

    expect(issuer).toStrictEqual('https://example.com');
  });

  it('should return empty string if issuer is not present in document', async () => {
    const issuer = _getIssuer(undefined);

    expect(issuer).toStrictEqual('');
  });
});
