import { Logger } from '@dvp/server-common';
import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { models } from '../db';
import { S3Event } from '../model/s3-event';
import { EventService } from './event.service';

import {
  mockCreateObjectS3Record,
  mockRemoveObjectS3Record,
} from './mock-event';

jest.mock('../db', () => ({
  models: {
    DocumentSchema: {
      get: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    },
  },
}));

const mockDynamoUpdate = models.DocumentSchema.update as jest.Mock;
const mockDynamoGet = models.DocumentSchema.get as jest.Mock;

describe('EventService', () => {
  const logger = Logger.from();
  const eventService = new EventService(logger);
  let processMessageSpy: jest.SpyInstance;

  const fakeEvent = {
    Records: [
      {
        messageId: 'someId',
        receiptHandle: 'someHandle',
        body: JSON.stringify({
          Records: [mockCreateObjectS3Record, mockRemoveObjectS3Record],
        }),
      },
    ],
  } as SQSEvent;

  describe('handle', () => {
    beforeEach(() => {
      processMessageSpy = jest.spyOn(eventService, 'processMessage');
    });

    it('should call process message for each of the records', async () => {
      await eventService.handle(fakeEvent);
      expect(processMessageSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('processMessage', () => {
    beforeAll(() => {
      processMessageSpy.mockRestore();
    });
    beforeEach(() => {
      mockDynamoUpdate.mockClear();
    });
    it('should ignore the message if it ends with /', async () => {
      const event = new S3Event('bucket', '/test/path/', false);
      await eventService.processMessage(event);
      expect(mockDynamoUpdate).not.toBeCalled();
    });

    it(`should ignore the message if it doesn't follow the folder structure`, async () => {
      const event = new S3Event('bucket', '/test/path/nested/path', false);
      await eventService.processMessage(event);
      expect(mockDynamoUpdate).not.toBeCalled();
    });

    it('should update dynamo with the create s3 object key', async () => {
      const event = new S3Event(
        mockCreateObjectS3Record.s3.bucket.name,
        mockCreateObjectS3Record.s3.object.key,
        false
      );
      await eventService.processMessage(event);

      expect(mockDynamoUpdate).toBeCalledWith(
        {
          name: 'AANZFTA-COO',
          schemaPath: 'AANZFTA-COO/partial/schema.json',
          type: 'partial',
        },
        { exists: null }
      );
    });

    it('should update dynamo with the removed s3 object key', async () => {
      const event = new S3Event(
        mockCreateObjectS3Record.s3.bucket.name,
        mockCreateObjectS3Record.s3.object.key,
        true
      );
      const documentSchema = {
        name: 'AANZFTA-COO',
        uiSchemaPath: 'AANZFTA-COO/partial/uischema.json',
        type: 'partial',
      };
      mockDynamoGet.mockResolvedValue(documentSchema);
      await eventService.processMessage(event);

      expect(mockDynamoUpdate).toBeCalledWith({
        name: 'AANZFTA-COO',
        schemaPath: '',
        type: 'partial',
      });
    });
  });
  describe('mapToS3Events', () => {
    it('should map sqs event to s3 events', () => {
      const records = eventService.mapToS3Events(fakeEvent);
      expect(records.length).toBe(2);
      expect(records[0]).toEqual(
        expect.objectContaining(
          new S3Event(
            mockCreateObjectS3Record.s3.bucket.name,
            mockCreateObjectS3Record.s3.object.key,
            false
          )
        )
      );
      expect(records[1]).toEqual(
        expect.objectContaining(
          new S3Event(
            mockRemoveObjectS3Record.s3.bucket.name,
            mockRemoveObjectS3Record.s3.object.key,
            true
          )
        )
      );
    });
  });
});
