import {
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient as AWSSQSCLient,
} from '@aws-sdk/client-sqs';

const sqsClient = new AWSSQSCLient(
  process.env['ENABLE_LOCALSTACK']
    ? {
        region: process.env['REVOCATION_QUEUE_REGION'],
        endpoint: process.env['LOCALSTACK_ENDPOINT'],
      }
    : {}
);

/**
 * This class handles sending messages to AWS SQS.
 */
export class SQSClient {
  /**s
   * Sends a message to the target queue.
   *
   * @param payload The message body to be sent to the queue
   * @param queueUrl The target queue. Defaults to Revocation Queue.
   */
  public static async sendMessage(
    payload: string,
    queueUrl = process.env['REVOCATION_QUEUE_URL']
  ) {
    const params: SendMessageCommandInput = {
      MessageBody: payload,
      QueueUrl: queueUrl,
    };

    await sqsClient.send(new SendMessageCommand(params));
  }
}
