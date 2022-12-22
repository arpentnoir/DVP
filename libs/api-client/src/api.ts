/* tslint:disable */
/* eslint-disable */
/**
 * DVP
 * API for the Digital Verification Platform
 *
 * The version of the OpenAPI document: 0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import globalAxios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
} from 'axios';
import { Configuration } from './configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import {
  assertParamExists,
  createRequestFunction,
  DUMMY_BASE_URL,
  serializeDataIfNeeded,
  setSearchParams,
  toPathString,
} from './common';
// @ts-ignore
import { BaseAPI, BASE_PATH, RequestArgs } from './base';

/**
 * A JSON-LD Verifiable Credential without a proof.
 * @export
 * @interface Credential
 */
export interface Credential {
  [key: string]: any;

  /**
   * The JSON-LD context of the credential.
   * @type {Array<string>}
   * @memberof Credential
   */
  '@context': Array<string>;
  /**
   * The ID of the credential.
   * @type {string}
   * @memberof Credential
   */
  id?: string;
  /**
   * The JSON-LD type of the credential.
   * @type {Array<string>}
   * @memberof Credential
   */
  type: Array<string>;
  /**
   * The issuanceDate
   * @type {string}
   * @memberof Credential
   */
  issuanceDate: string;
  /**
   * The expirationDate
   * @type {string}
   * @memberof Credential
   */
  expirationDate?: string;
  /**
   * The subject
   * @type {object}
   * @memberof Credential
   */
  credentialSubject: object;
  /**
   *
   * @type {Issuer}
   * @memberof Credential
   */
  issuer: Issuer;
}
/**
 *
 * @export
 * @interface DocumentUploadRequest
 */
export interface DocumentUploadRequest {
  /**
   * strigified document to upload
   * @type {string}
   * @memberof DocumentUploadRequest
   */
  document: string;
  /**
   *
   * @type {string}
   * @memberof DocumentUploadRequest
   */
  documentId?: string;
  /**
   * Key used for encryption
   * @type {string}
   * @memberof DocumentUploadRequest
   */
  encryptionKey?: string;
}
/**
 *
 * @export
 * @interface DocumentUploadResponse
 */
export interface DocumentUploadResponse {
  /**
   *
   * @type {string}
   * @memberof DocumentUploadResponse
   */
  documentId: string;
  /**
   * Key used for encryption
   * @type {string}
   * @memberof DocumentUploadResponse
   */
  encryptionKey: string;
}
/**
 *
 * @export
 * @interface EncryptedDocumentObject
 */
export interface EncryptedDocumentObject {
  /**
   *
   * @type {EncryptedDocumentObjectDocument}
   * @memberof EncryptedDocumentObject
   */
  document: EncryptedDocumentObjectDocument;
}
/**
 *
 * @export
 * @interface EncryptedDocumentObjectDocument
 */
export interface EncryptedDocumentObjectDocument {
  /**
   * Encrypted verifiable credential
   * @type {string}
   * @memberof EncryptedDocumentObjectDocument
   */
  cipherText: string;
  /**
   * Initialisation vector
   * @type {string}
   * @memberof EncryptedDocumentObjectDocument
   */
  iv: string;
  /**
   * Message authentication code (MAC)
   * @type {string}
   * @memberof EncryptedDocumentObjectDocument
   */
  tag: string;
  /**
   * Encryption algorithm identifier (OA)
   * @type {string}
   * @memberof EncryptedDocumentObjectDocument
   */
  type: string;
}
/**
 * An object containing references to the source of an error.
 * @export
 * @interface ErrorSource
 */
export interface ErrorSource {
  /**
   * A JSON Pointer which describes which property in the request object to which an error message relates.  For more details on JSON pointers see [RFC6901](https://tools.ietf.org/html/rfc6901).
   * @type {string}
   * @memberof ErrorSource
   */
  pointer?: string;
  /**
   * Describes the location of the data to which the error message is related.  - **\"REQUEST\"** - Indicates the message relates to a _property_ within the request   object. The `pointer` property should be populated in this case. - **\"QUERY\"** - Indicates the message relates to a _query_ parameter. The `parameter`   property should be populated in this case. - **\"ID\"** - Indicates the message relates to the identifier of the REST resource. The   `parameter` property _may optionally_ be populated in this case.
   * @type {string}
   * @memberof ErrorSource
   */
  location?: ErrorSourceLocationEnum;
  /**
   * A string indicating which URI query parameter caused the error.
   * @type {string}
   * @memberof ErrorSource
   */
  parameter?: string;
}

export const ErrorSourceLocationEnum = {
  Request: 'REQUEST',
  Query: 'QUERY',
  Id: 'ID',
} as const;

export type ErrorSourceLocationEnum =
  typeof ErrorSourceLocationEnum[keyof typeof ErrorSourceLocationEnum];

/**
 * A schema for the `errors` array.
 * @export
 * @interface ErrorsArray
 */
export interface ErrorsArray {
  /**
   *
   * @type {Array<Error>}
   * @memberof ErrorsArray
   */
  errors?: Array<Error>;
}
/**
 * The response returned when one or more errors have been encountered.
 * @export
 * @interface ErrorsResponseSchema
 */
export interface ErrorsResponseSchema {
  /**
   *
   * @type {Array<Error>}
   * @memberof ErrorsResponseSchema
   */
  errors: Array<Error>;
}
/**
 *
 * @export
 * @interface IssueCredentialRequest
 */
export interface IssueCredentialRequest {
  /**
   *
   * @type {string}
   * @memberof IssueCredentialRequest
   */
  signingMethod?: IssueCredentialRequestSigningMethodEnum;
  /**
   *
   * @type {Credential}
   * @memberof IssueCredentialRequest
   */
  credential: Credential;
}

export const IssueCredentialRequestSigningMethodEnum = {
  Svip: 'SVIP',
  Oa: 'OA',
} as const;

export type IssueCredentialRequestSigningMethodEnum =
  typeof IssueCredentialRequestSigningMethodEnum[keyof typeof IssueCredentialRequestSigningMethodEnum];

/**
 *
 * @export
 * @interface IssueCredentialResponse
 */
export interface IssueCredentialResponse {
  /**
   *
   * @type {VerifiableCredential}
   * @memberof IssueCredentialResponse
   */
  verifiableCredential?: VerifiableCredential;
}
/**
 * @type Issuer
 * A JSON-LD Verifiable Credential Issuer.
 * @export
 */
export type Issuer = IssuerOneOf | string;

/**
 *
 * @export
 * @interface IssuerOneOf
 */
export interface IssuerOneOf {
  /**
   *
   * @type {string}
   * @memberof IssuerOneOf
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof IssuerOneOf
   */
  name?: string;
}
/**
 * A JSON-LD Linked Data proof.
 * @export
 * @interface LinkedDataProof
 */
export interface LinkedDataProof {
  /**
   * Linked Data Signature Suite used to produce proof.
   * @type {string}
   * @memberof LinkedDataProof
   */
  type?: string;
  /**
   * Date the proof was created.
   * @type {string}
   * @memberof LinkedDataProof
   */
  created?: string;
  /**
   * A value chosen by the verifier to mitigate authentication proof replay attacks.
   * @type {string}
   * @memberof LinkedDataProof
   */
  challenge?: string;
  /**
   * The domain of the proof to restrict its use to a particular target.
   * @type {string}
   * @memberof LinkedDataProof
   */
  domain?: string;
  /**
   * A value chosen by the creator of a proof to randomize proof values for privacy purposes.
   * @type {string}
   * @memberof LinkedDataProof
   */
  nonce?: string;
  /**
   * Verification Method used to verify proof.
   * @type {string}
   * @memberof LinkedDataProof
   */
  verificationMethod?: string;
  /**
   * The purpose of the proof to be used with verificationMethod.
   * @type {string}
   * @memberof LinkedDataProof
   */
  proofPurpose?: string;
  /**
   * Detached JSON Web Signature.
   * @type {string}
   * @memberof LinkedDataProof
   */
  jws?: string;
  /**
   * Value of the Linked Data proof.
   * @type {string}
   * @memberof LinkedDataProof
   */
  proofValue?: string;
}
/**
 * An object containing the details of a particular error.
 * @export
 * @interface ModelError
 */
export interface ModelError {
  /**
   * A unique identifier for the error occurrence, to provide traceability in application logs.
   * @type {string}
   * @memberof ModelError
   */
  id?: string;
  /**
   * A provider-specific or enterprise defined error code. Codes must be in uppercase.
   * @type {string}
   * @memberof ModelError
   */
  code: string;
  /**
   * A provider-specific or enterprise defined error message.
   * @type {string}
   * @memberof ModelError
   */
  detail: string;
  /**
   *
   * @type {ErrorSource}
   * @memberof ModelError
   */
  source?: ErrorSource;
  /**
   * A URL which leads to further details about the error (e.g. A help page).
   * @type {string}
   * @memberof ModelError
   */
  helpUrl?: string;
  /**
   * Help text which can provide further assistance on the error.
   * @type {string}
   * @memberof ModelError
   */
  helpText?: string;
}
/**
 * A JSON-LD Verifiable Credential with a proof.
 * @export
 * @interface VerifiableCredential
 */
export interface VerifiableCredential {
  /**
   * The JSON-LD context of the credential.
   * @type {Array<string>}
   * @memberof VerifiableCredential
   */
  '@context': Array<string>;
  /**
   * The ID of the credential.
   * @type {string}
   * @memberof VerifiableCredential
   */
  id?: string;
  /**
   * The JSON-LD type of the credential.
   * @type {Array<string>}
   * @memberof VerifiableCredential
   */
  type: Array<string>;
  /**
   * The issuanceDate
   * @type {string}
   * @memberof VerifiableCredential
   */
  issuanceDate: string;
  /**
   * The expirationDate
   * @type {string}
   * @memberof VerifiableCredential
   */
  expirationDate?: string;
  /**
   * The subject
   * @type {object}
   * @memberof VerifiableCredential
   */
  credentialSubject: object;
  /**
   *
   * @type {Issuer}
   * @memberof VerifiableCredential
   */
  issuer: Issuer;
  /**
   *
   * @type {LinkedDataProof}
   * @memberof VerifiableCredential
   */
  proof?: LinkedDataProof;
}
/**
 *
 * @export
 * @interface VerifiableCredentialAllOf
 */
export interface VerifiableCredentialAllOf {
  /**
   *
   * @type {LinkedDataProof}
   * @memberof VerifiableCredentialAllOf
   */
  proof?: LinkedDataProof;
}
/**
 * Object summarizing a verification
 * @export
 * @interface VerificationResult
 */
export interface VerificationResult {
  /**
   * The checks performed
   * @type {Array<string>}
   * @memberof VerificationResult
   */
  checks?: Array<string>;
  /**
   * Warnings
   * @type {Array<string>}
   * @memberof VerificationResult
   */
  warnings?: Array<string>;
  /**
   * Errors
   * @type {Array<string>}
   * @memberof VerificationResult
   */
  errors?: Array<string>;
}
/**
 *
 * @export
 * @interface VerifyCredentialRequest
 */
export interface VerifyCredentialRequest {
  /**
   *
   * @type {VerifiableCredential}
   * @memberof VerifyCredentialRequest
   */
  verifiableCredential?: VerifiableCredential;
}

/**
 * CredentialsApi - axios parameter creator
 * @export
 */
export const CredentialsApiAxiosParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     * Issues a credential and returns it in the response body.
     * @summary Issues a credential and returns it in the response body.
     * @param {IssueCredentialRequest} [issueCredentialRequest] Parameters for issuing the credential.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    issueCredential: async (
      issueCredentialRequest?: IssueCredentialRequest,
      options: AxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/issue`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: 'POST',
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      localVarHeaderParameter['Content-Type'] = 'application/json';

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        issueCredentialRequest,
        localVarRequestOptions,
        configuration
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * Verifies a verifiableCredential and returns a verificationResult in the response body.
     * @summary Verifies a verifiableCredential and returns a verificationResult in the response body.
     * @param {VerifyCredentialRequest} [verifyCredentialRequest] Parameters for verifying a verifiableCredential.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    verifyCredential: async (
      verifyCredentialRequest?: VerifyCredentialRequest,
      options: AxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/verify`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: 'POST',
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      localVarHeaderParameter['Content-Type'] = 'application/json';

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        verifyCredentialRequest,
        localVarRequestOptions,
        configuration
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * CredentialsApi - functional programming interface
 * @export
 */
export const CredentialsApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator =
    CredentialsApiAxiosParamCreator(configuration);
  return {
    /**
     * Issues a credential and returns it in the response body.
     * @summary Issues a credential and returns it in the response body.
     * @param {IssueCredentialRequest} [issueCredentialRequest] Parameters for issuing the credential.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async issueCredential(
      issueCredentialRequest?: IssueCredentialRequest,
      options?: AxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<IssueCredentialResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.issueCredential(
        issueCredentialRequest,
        options
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      );
    },
    /**
     * Verifies a verifiableCredential and returns a verificationResult in the response body.
     * @summary Verifies a verifiableCredential and returns a verificationResult in the response body.
     * @param {VerifyCredentialRequest} [verifyCredentialRequest] Parameters for verifying a verifiableCredential.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async verifyCredential(
      verifyCredentialRequest?: VerifyCredentialRequest,
      options?: AxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<VerificationResult>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.verifyCredential(
          verifyCredentialRequest,
          options
        );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      );
    },
  };
};

/**
 * CredentialsApi - factory interface
 * @export
 */
export const CredentialsApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = CredentialsApiFp(configuration);
  return {
    /**
     * Issues a credential and returns it in the response body.
     * @summary Issues a credential and returns it in the response body.
     * @param {IssueCredentialRequest} [issueCredentialRequest] Parameters for issuing the credential.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    issueCredential(
      issueCredentialRequest?: IssueCredentialRequest,
      options?: any
    ): AxiosPromise<IssueCredentialResponse> {
      return localVarFp
        .issueCredential(issueCredentialRequest, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * Verifies a verifiableCredential and returns a verificationResult in the response body.
     * @summary Verifies a verifiableCredential and returns a verificationResult in the response body.
     * @param {VerifyCredentialRequest} [verifyCredentialRequest] Parameters for verifying a verifiableCredential.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    verifyCredential(
      verifyCredentialRequest?: VerifyCredentialRequest,
      options?: any
    ): AxiosPromise<VerificationResult> {
      return localVarFp
        .verifyCredential(verifyCredentialRequest, options)
        .then((request) => request(axios, basePath));
    },
  };
};

/**
 * CredentialsApi - interface
 * @export
 * @interface CredentialsApi
 */
export interface CredentialsApiInterface {
  /**
   * Issues a credential and returns it in the response body.
   * @summary Issues a credential and returns it in the response body.
   * @param {IssueCredentialRequest} [issueCredentialRequest] Parameters for issuing the credential.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CredentialsApiInterface
   */
  issueCredential(
    issueCredentialRequest?: IssueCredentialRequest,
    options?: AxiosRequestConfig
  ): AxiosPromise<IssueCredentialResponse>;

  /**
   * Verifies a verifiableCredential and returns a verificationResult in the response body.
   * @summary Verifies a verifiableCredential and returns a verificationResult in the response body.
   * @param {VerifyCredentialRequest} [verifyCredentialRequest] Parameters for verifying a verifiableCredential.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CredentialsApiInterface
   */
  verifyCredential(
    verifyCredentialRequest?: VerifyCredentialRequest,
    options?: AxiosRequestConfig
  ): AxiosPromise<VerificationResult>;
}

/**
 * CredentialsApi - object-oriented interface
 * @export
 * @class CredentialsApi
 * @extends {BaseAPI}
 */
export class CredentialsApi extends BaseAPI implements CredentialsApiInterface {
  /**
   * Issues a credential and returns it in the response body.
   * @summary Issues a credential and returns it in the response body.
   * @param {IssueCredentialRequest} [issueCredentialRequest] Parameters for issuing the credential.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CredentialsApi
   */
  public issueCredential(
    issueCredentialRequest?: IssueCredentialRequest,
    options?: AxiosRequestConfig
  ) {
    return CredentialsApiFp(this.configuration)
      .issueCredential(issueCredentialRequest, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * Verifies a verifiableCredential and returns a verificationResult in the response body.
   * @summary Verifies a verifiableCredential and returns a verificationResult in the response body.
   * @param {VerifyCredentialRequest} [verifyCredentialRequest] Parameters for verifying a verifiableCredential.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof CredentialsApi
   */
  public verifyCredential(
    verifyCredentialRequest?: VerifyCredentialRequest,
    options?: AxiosRequestConfig
  ) {
    return CredentialsApiFp(this.configuration)
      .verifyCredential(verifyCredentialRequest, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     *
     * @summary Get encrypted document by Id
     * @param {string} documentId The encrypted documents object Id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    storageDocumentsDocumentIdGet: async (
      documentId: string,
      options: AxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'documentId' is not null or undefined
      assertParamExists(
        'storageDocumentsDocumentIdGet',
        'documentId',
        documentId
      );
      const localVarPath = `/storage/documents/{documentId}`.replace(
        `{${'documentId'}}`,
        encodeURIComponent(String(documentId))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: 'GET',
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @summary encrypt and upload document
     * @param {DocumentUploadRequest} [documentUploadRequest] Parameters uploading the document
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    storageDocumentsPost: async (
      documentUploadRequest?: DocumentUploadRequest,
      options: AxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/storage/documents`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: 'POST',
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      localVarHeaderParameter['Content-Type'] = 'application/json';

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        documentUploadRequest,
        localVarRequestOptions,
        configuration
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration);
  return {
    /**
     *
     * @summary Get encrypted document by Id
     * @param {string} documentId The encrypted documents object Id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async storageDocumentsDocumentIdGet(
      documentId: string,
      options?: AxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<EncryptedDocumentObject>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.storageDocumentsDocumentIdGet(
          documentId,
          options
        );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      );
    },
    /**
     *
     * @summary encrypt and upload document
     * @param {DocumentUploadRequest} [documentUploadRequest] Parameters uploading the document
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async storageDocumentsPost(
      documentUploadRequest?: DocumentUploadRequest,
      options?: AxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<DocumentUploadResponse>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.storageDocumentsPost(
          documentUploadRequest,
          options
        );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      );
    },
  };
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = DefaultApiFp(configuration);
  return {
    /**
     *
     * @summary Get encrypted document by Id
     * @param {string} documentId The encrypted documents object Id
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    storageDocumentsDocumentIdGet(
      documentId: string,
      options?: any
    ): AxiosPromise<EncryptedDocumentObject> {
      return localVarFp
        .storageDocumentsDocumentIdGet(documentId, options)
        .then((request) => request(axios, basePath));
    },
    /**
     *
     * @summary encrypt and upload document
     * @param {DocumentUploadRequest} [documentUploadRequest] Parameters uploading the document
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    storageDocumentsPost(
      documentUploadRequest?: DocumentUploadRequest,
      options?: any
    ): AxiosPromise<DocumentUploadResponse> {
      return localVarFp
        .storageDocumentsPost(documentUploadRequest, options)
        .then((request) => request(axios, basePath));
    },
  };
};

/**
 * DefaultApi - interface
 * @export
 * @interface DefaultApi
 */
export interface DefaultApiInterface {
  /**
   *
   * @summary Get encrypted document by Id
   * @param {string} documentId The encrypted documents object Id
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApiInterface
   */
  storageDocumentsDocumentIdGet(
    documentId: string,
    options?: AxiosRequestConfig
  ): AxiosPromise<EncryptedDocumentObject>;

  /**
   *
   * @summary encrypt and upload document
   * @param {DocumentUploadRequest} [documentUploadRequest] Parameters uploading the document
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApiInterface
   */
  storageDocumentsPost(
    documentUploadRequest?: DocumentUploadRequest,
    options?: AxiosRequestConfig
  ): AxiosPromise<DocumentUploadResponse>;
}

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI implements DefaultApiInterface {
  /**
   *
   * @summary Get encrypted document by Id
   * @param {string} documentId The encrypted documents object Id
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public storageDocumentsDocumentIdGet(
    documentId: string,
    options?: AxiosRequestConfig
  ) {
    return DefaultApiFp(this.configuration)
      .storageDocumentsDocumentIdGet(documentId, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @summary encrypt and upload document
   * @param {DocumentUploadRequest} [documentUploadRequest] Parameters uploading the document
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public storageDocumentsPost(
    documentUploadRequest?: DocumentUploadRequest,
    options?: AxiosRequestConfig
  ) {
    return DefaultApiFp(this.configuration)
      .storageDocumentsPost(documentUploadRequest, options)
      .then((request) => request(this.axios, this.basePath));
  }
}
