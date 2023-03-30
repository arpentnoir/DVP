import { Logger } from '@dvp/server-common';
import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { models } from '../db';
import { CredentialStatus } from '@dvp/api-client';
import { StatusService } from './status.service';

/**
 * A service class responsible for processing revocation events from the queue.
 */
export class EventService {
  constructor(private readonly logger: Logger) {}

  /**
   * Handles an sqs event by processing every message of it
   *
   * @param sqsEvent The SQS Event Object
   */
  async handle(sqsEvent: SQSEvent) {
    try {
      // Handles 1 event at a time;
      const record = sqsEvent.Records[0];

      const { documentId, credentialStatus, invocationContext } = JSON.parse(
        record.body
      );

      const { userAbn } = invocationContext;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const statusService = new StatusService(invocationContext);

      await statusService.setRevocationStatus(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        documentId,
        credentialStatus as CredentialStatus[]
      );

      await models.Document.update({
        id: documentId,
        abn: userAbn,
        revocationInProgress: false,
      });

      this.logger.info(
        '[EventService.handle] processed message successfully : %o',
        record
      );
    } catch (err) {
      this.logger.error(
        '[EventService.handle] Error processing the event: %o, error: %s',
        sqsEvent.Records[0],
        err
      );
    }
  }
}
