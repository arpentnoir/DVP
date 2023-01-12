import { IssueCredentialRequestSigningMethodEnum } from '@dvp/api-client';
import {
  CredentialSubject,
  VerifiableCredential,
  VerificationResult,
} from '@dvp/api-interfaces';
import { AxiosError } from 'axios';
import { axiosInstance } from './api.service';

import { isOpenAttestationType } from '@dvp/vc-ui';
import {
  API_ENDPOINTS,
  FAIL_CREATE_VC,
  GENERIC_OA_META_DATA,
  GENERIC_SVIP_META_DATA,
} from '../constants';

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
    const res = await axiosInstance.post<VerificationResult>(
      API_ENDPOINTS.VERIFY,
      {
        verifiableCredential: document,
      }
    );

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

export const issue = async (
  credentialSubject: CredentialSubject,
  credentialType: string
) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.ISSUE, {
      credential: {
        ...(credentialType === 'oa'
          ? GENERIC_OA_META_DATA
          : GENERIC_SVIP_META_DATA),
        issuanceDate: new Date().toISOString(),
        credentialSubject: credentialSubject,
      },
      signingMethod:
        credentialType === 'oa'
          ? IssueCredentialRequestSigningMethodEnum.Oa
          : IssueCredentialRequestSigningMethodEnum.Svip,
    });

    return response;
  } catch (err: unknown | AxiosError) {
    throw new Error(FAIL_CREATE_VC);
  }
};
