import { Logger } from '@dvp/server-common';
import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { EventService } from './services/event.service';

/*
 * Entry point for consumer that will be triggered from sqs events
 */
export const handler = async (sqsEvent: SQSEvent) => {
  const logger = Logger.from();
  logger.info('event, %o', sqsEvent);
  const eventService = new EventService(logger);
  return eventService.handle(sqsEvent);
};
