import { VerifiableCredential, VerificationResult } from '@dvp/api-interfaces';
import { isOpenAttestationType } from '@dvp/vc-ui';
import axios, { AxiosError } from 'axios';
import { API_ENDPOINTS } from '../constants';

export const _getIssuer = (document: VerifiableCredential) => ({
  id: isOpenAttestationType(document)
    ? document.openAttestationMetadata?.identityProof.identifier
    : typeof document.issuer === 'object'
    ? document.issuer.id
    : document.issuer,
});

// TODO: Refactor and write tests once verify endpoint response format is confirmed
export const verify = async (document: VerifiableCredential) => {
  try {
    const res = await axios.post<VerificationResult>(API_ENDPOINTS.VERIFY, {
      verifiableCredential: document,
    });

    return {
      document,
      results: { ...res.data, issuer: _getIssuer(document) },
    };
  } catch (err: unknown | AxiosError) {
    // If verification fails a 400 is returned, but we still want to return result
    if (err instanceof AxiosError && err?.response?.data) {
      const error = err as AxiosError<VerificationResult>;
      return {
        document,
        results: { ...error?.response?.data, issuer: _getIssuer(document) },
      };
    }
    throw err;
  }
};
