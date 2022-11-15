import axios from 'axios';
import { Document } from '@dvp/api-interfaces';
import { API_ENDPOINTS } from '../constants';

export const _getIssuer = (document: Document) => ({
  id: document?.issuer?.id ?? '',
  name: document?.issuer?.name ?? '',
});

// TODO: Refactor and write tests once verify endpoint response format is confirmed
export const verify = async (document: Document) => {
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
