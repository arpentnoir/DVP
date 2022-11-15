import { VerifiableCredential } from '@dvp/api-interfaces';
import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

export const _getIssuer = (document: VerifiableCredential) =>
  typeof document?.issuer !== 'string'
    ? {
        id: document?.issuer?.id ?? '',
        name: document?.issuer?.name ?? '',
      }
    : '';

// TODO: Refactor and write tests once verify endpoint response format is confirmed
export const verify = async (document: VerifiableCredential) => {
  try {
    const res = await axios.post(API_ENDPOINTS.VERIFY, {
      verifiableCredential: document,
    });

    return {
      document,
      results: { ...res.data, issuer: _getIssuer(document) },
    };
  } catch (err: any) {
    // If verification fails a 400 is returned, but we still want to return result
    if (err.response.data) {
      return {
        document,
        results: { ...err.response.data, issuer: _getIssuer(document) },
      };
    }
    throw err;
  }
};
