import { VerifiableCredential } from '@dvp/api-interfaces';
import { CHAFTA_COO, SVIP_CHAFTA_COO } from '../mocks/fixtures/documents';
import { _getIssuer } from './vc.service';

describe('_getIssuer', () => {
  describe('OA', () => {
    it('should return issuer if present in document', () => {
      const issuer = _getIssuer(CHAFTA_COO as VerifiableCredential);

      expect(issuer).toStrictEqual({
        id: 'demo-tradetrust.openattestation.com',
      });
    });

    it('should return undefined if issuer is not present in document', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { openAttestationMetadata, ...withoutIssuer } = CHAFTA_COO;
      const iss = _getIssuer(withoutIssuer as never);

      expect(iss).toStrictEqual({ id: undefined });
    });
  });
  describe('SVIP', () => {
    it('should return issuer if present in document', () => {
      const issuer = _getIssuer(SVIP_CHAFTA_COO as VerifiableCredential);

      expect(issuer).toStrictEqual({
        id: 'did:key:z6MkvsJoJF1ucfDbqVsbmTnxypFYCLAKZSuCMjPv4a3yLG3u',
      });
    });

    it('should return  undefined if issuer is not present in document', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { issuer, ...withoutIssuer } = SVIP_CHAFTA_COO;
      const iss = _getIssuer(withoutIssuer as never);

      expect(iss).toStrictEqual({ id: undefined });
    });
  });
});
