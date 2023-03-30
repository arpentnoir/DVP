import { IssueCredentialRequestSigningMethodEnum } from '@dvp/api-client';
import { AxiosError } from 'axios';
import { axiosInstance } from './api.service';

import { API_ENDPOINTS, REVOCATION_FAILED_MESSAGE } from '../constants';

enum RevocationType {
  OpenAttestationOcsp = 'OpenAttestationOCSP',
  RevocationList2020Status = 'RevocationList2020Status',
}

enum RevocationStatusCode {
  REVOKED = '1',
  NOT_REVOKED = '0',
}

/**
 * Submits the revocation action to the status queue for processing.
 *
 * @param param0 The data of the VC to be revoked or unrevoked.
 */
export const setRevocationStatus = async ({
  credentialId,
  signingMethod,
  revoke,
}: {
  credentialId: string;
  signingMethod: IssueCredentialRequestSigningMethodEnum;
  revoke: boolean;
}) => {
  try {
    await axiosInstance.post(API_ENDPOINTS.REVOKE, {
      credentialId: `urn:uuid:${credentialId}`,
      credentialStatus: [
        {
          type:
            signingMethod === IssueCredentialRequestSigningMethodEnum.Oa
              ? RevocationType.OpenAttestationOcsp
              : RevocationType.RevocationList2020Status,
          status: revoke
            ? RevocationStatusCode.REVOKED
            : RevocationStatusCode.NOT_REVOKED,
        },
      ],
    });
  } catch (err: unknown | AxiosError) {
    throw new Error(REVOCATION_FAILED_MESSAGE);
  }
};
