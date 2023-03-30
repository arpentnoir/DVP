import { mockClient } from 'aws-sdk-client-mock';
import {
  SendMessageCommand,
  SQSClient as AWSSQSCLient,
} from '@aws-sdk/client-sqs';
import { SQSClient } from './sqs-client';
import 'aws-sdk-client-mock-jest';

/* eslint-disable @typescript-eslint/no-unsafe-argument */
const sqsClientMock = mockClient(AWSSQSCLient as any);

describe('sqs-client', () => {
  beforeEach(() => {
    sqsClientMock.reset();
  });
  it('should send message to queue', async () => {
    const payload = 'Up and at them';

    await SQSClient.sendMessage(payload, 'test-queue');

    expect(sqsClientMock).toHaveReceivedNthCommandWith(
      1,
      /* eslint-disable @typescript-eslint/no-unsafe-argument */
      SendMessageCommand as any,
      {
        MessageBody: payload,
        QueueUrl: 'test-queue',
      }
    );
  });
});
