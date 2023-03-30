import { SQSClient } from '@aws-sdk/client-sqs';
import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { Consumer } from 'sqs-consumer';
import { handler } from './';

/**
 * This is used for local development because it is easier
 * to work with as changes are hot-reloaded.
 */
const app = Consumer.create({
  queueUrl: process.env.REVOCATION_QUEUE_URL,
  handleMessage: async (message) => {
    // Convert to sqsEvent
    // Only 1 event at at time
    const sqsEvent = {
      Records: [
        {
          body: message.Body,
        },
      ],
    } as SQSEvent;

    await handler(sqsEvent);
  },
  sqs: new SQSClient({
    region: process.env.REVOCATION_QUEUE_REGION,
    endpoint: process.env.LOCALSTACK_ENDPOINT,
  }),
  batchSize: 1,
});

if (process.env.ENABLE_LOCALSTACK) {
  app.start();
}
