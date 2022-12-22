import { IssueCredentialRequestSigningMethodEnum } from '@dvp/api-client';
import { IssuerFunction, VerifiableCredential } from '@dvp/api-interfaces';
import {
  ApplicationError,
  Logger,
  openAttestation,
  RequestInvocationContext,
  transmute,
  ValidationError,
} from '@dvp/server-common';
import { config } from '../../config';

export class IssueService {
  logger: Logger;
  invocationContext: RequestInvocationContext;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
  }

  // Currently only OpenAttestation is supported
  getIssuer(
    signingMethod: IssueCredentialRequestSigningMethodEnum,
    credential: VerifiableCredential
  ): IssuerFunction {
    if (signingMethod === IssueCredentialRequestSigningMethodEnum.Oa) {
      return openAttestation.issueCredential;
    } else if (signingMethod === IssueCredentialRequestSigningMethodEnum.Svip) {
      return (credential) =>
        transmute.issueCredential({
          credential: credential as VerifiableCredential,
          mnemonic: config.didConfig.mnemonic,
        }) as Promise<VerifiableCredential>;
    } else {
      this.logger.debug(
        '[IssuerService.getIssuer] Unknown credential type found, %o',
        signingMethod,
        credential
      );

      throw new ValidationError('signingMethod', signingMethod);
    }
  }

  async issue(
    signingMethod: IssueCredentialRequestSigningMethodEnum,
    credential: VerifiableCredential
  ): Promise<VerifiableCredential> {
    try {
      const issuer = this.getIssuer(signingMethod, credential);

      // Temporarily hardcoding verificationMethod and key
      const issuerKeyId =
        'did:ethr:0x4Bf4190a27A37d1677c8ADE25b53F1e22885531f#controller';
      const privateKey =
        '0x17036c69d211cb39dea5fa0ab71aa2b55797ae4506062ff878a82e52575b97c0';

      const signedDocument = await issuer(credential, issuerKeyId, privateKey);

      return signedDocument;
    } catch (err: unknown) {
      this.logger.debug(
        '[IssueService.issue] Failed to issue verifiable credential, %o',
        err
      );
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new Error(`Failed to issue verifiable credential`);
    }
  }
}
