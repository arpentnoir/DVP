import {
  IssueResult,
  IssuerFunction,
  VerifiableCredential,
} from '@dvp/api-interfaces';
import { Logger, RequestInvocationContext } from '@dvp/server-common';
import { issue as oAIssue } from './openAttestation';

export class IssueService {
  logger: Logger;
  invocationContext: RequestInvocationContext;

  constructor(invocationContext: RequestInvocationContext) {
    this.invocationContext = invocationContext;
    this.logger = Logger.from(invocationContext);
  }

  // Currently only OpenAttestation is supported
  getIssuer(credential: VerifiableCredential) {
    if (credential?.type?.includes('OpenAttestationCredential')) {
      return oAIssue;
    } else {
      this.logger.debug(
        '[IssuerService.getIssuer] Unknown credential type found, %o',
        credential
      );

      throw new Error(
        'Only OpenAttestation credential type is currently supported'
      );
    }
  }

  async issue(credential: VerifiableCredential): Promise<IssueResult> {
    let issuer: IssuerFunction;

    try {
      issuer = this.getIssuer(credential);

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
      throw new Error(`Failed to issue verifiable credential`);
    }
  }
}
