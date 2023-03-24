import {
  CredentialsResponseItem,
  IssueCredentialRequestSigningMethodEnum,
} from '@dvp/api-client';
import {
  CredentialSubject,
  Pagination,
  VerifiableCredential,
  VerificationResult,
} from '@dvp/api-interfaces';
import { AxiosError } from 'axios';
import { axiosInstance } from './api.service';

import { isOpenAttestationType } from '@dvp/vc-ui';
import { isNull, isUndefined, omitBy } from 'lodash';
import {
  API_ENDPOINTS,
  FAIL_CREATE_VC,
  FAIL_FETCH_DOCUMENTS_ERR_MSG,
  GENERIC_OA_META_DATA,
  GENERIC_SVIP_META_DATA,
} from '../constants';
import { QueryFunction } from '../hooks';

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
  credentialType: string,
  formName: string,
  formType: string
) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.ISSUE, {
      credential: {
        ...(credentialType === 'oa'
          ? getOAMetaData(formName, formType)
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

/**
 * Takes the form type and returns GENERIC_OA_META_DATA with the appropriate template name
 * @param formName name of the form (corresponding to its template render)
 * @param formType the type of form full or partial
 * @returns returns GENERIC_OA_META_DATA with changed template
 */
export const getOAMetaData = (formName: string, formType: string) => {
  let TemplateName = formName;
  if (formType === 'partial') {
    TemplateName = formName + 'Partial';
  }

  const metaData = GENERIC_OA_META_DATA;
  metaData.openAttestationMetadata.template.name = TemplateName;

  return metaData;
};

/**
 * @typedef GetVCParams
 * @type {object}
 * @property {string} [nextCursor] - The cursor for the next page of data.
 * @property {string} [prevCursor] - The cursor for the previous page of data.
 * @property {number} [limit] - The maximum number of results to return.
 * @property {string} [q] - The query string for searching Verifiable Credentials.
 * @property {('asc' | 'desc')} [sort] - The sorting order for the results.
 */
interface GetVCParams {
  nextCursor?: string;
  prevCursor?: string;
  limit?: number;
  q?: string;
  sort?: 'asc' | 'desc';
}

/**
 * @function getVerifiableCredentials
 * @async
 * @param {string} query - The search query for the Verifiable Credentials.
 * @param {QueryFunctionOptions} options - The options for the query, including pagination and sort order.
 * @returns {Promise<QueryFunctionResponse<CredentialsResponseItem>>} A Promise that resolves with the query results and pagination.
 * @throws {Error} Will throw an error if the request fails.
 * @description Fetches the Verifiable Credentials based on the search query and the provided options.
 */
export const getVerifiableCredentials: QueryFunction<
  CredentialsResponseItem
> = async (query, options) => {
  try {
    const { pagination, sort } = options;

    const params: GetVCParams = {
      q: query ? encodeURIComponent(query) : undefined,
      ...omitBy(pagination, isNull),
      sort,
    };

    const searchParams = new URLSearchParams(
      omitBy(params, isUndefined)
    ).toString();

    return axiosInstance
      .get(`${API_ENDPOINTS.CREDENTIALS}?${searchParams}`)
      .then(
        (res) =>
          res.data as {
            results: CredentialsResponseItem[];
            pagination?: Pagination;
          }
      );
  } catch {
    throw new Error(FAIL_FETCH_DOCUMENTS_ERR_MSG);
  }
};
