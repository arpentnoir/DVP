import { IssueCredentialRequestSigningMethodEnum } from '@dvp/api-client';
import axios, { AxiosError } from 'axios';
import {
  API_ENDPOINTS,
  FAIL_CREATE_VC,
  GENERIC_OA_META_DATA,
  GENERIC_SVIP_META_DATA,
} from '../constants';

export const IssueVC = async (
  credentialSubject: any,
  credentialType: string
) => {
  try {
    const response = await axios.post(API_ENDPOINTS.ISSUE, {
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
