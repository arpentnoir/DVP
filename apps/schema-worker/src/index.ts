import { EventService } from './services';

import { Logger } from '@dvp/server-common';
import { SQSEvent } from 'aws-lambda/trigger/sqs';

/**
 * Entry point for consumer that will be triggered from sqs events
 */
export const handler = (sqsEvent: SQSEvent) => {
  const logger = Logger.from();
  logger.info('event, %o', sqsEvent);
  const eventService = new EventService(logger);
  return eventService.handle(sqsEvent);
};
