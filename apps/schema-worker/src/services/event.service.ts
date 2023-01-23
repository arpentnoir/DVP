import { DocumentSchemaType, Logger } from '@dvp/server-common';
import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { models } from '../db';
import { S3Event } from '../model/s3-event';
import { BucketNotificationEvent } from '../types';

export class EventService {
  constructor(private readonly logger: Logger) {}

  /**
   * Handles an sqs event by processing every message of it
   */
  async handle(event: SQSEvent) {
    const records = this.mapToS3Events(event);

    /**
     * Process all messages
     * To delete every message from the event from the queue that has been successful processed,the handle function must not throw an error.
     */
    const promises = records.map(async (event) => {
      try {
        await this.processMessage(event);
      } catch (error) {
        this.logger.error(
          '[EventService.handle] Error processing the event : %o, error: %s',
          event,
          error
        );
      }
    });

    await Promise.all(promises);
  }

  async processMessage(record: S3Event) {
    if (record.objectKey.endsWith('/')) {
      this.logger.info(
        '[EventService.processMessage] ignoring the message because key represents a folder: %o',
        record
      );
      return;
    }
    const splitKey = record.objectKey.split('/');
    if (splitKey.length !== 3) {
      this.logger.info(
        '[EventService.processMessage] ignoring the message because the folder structure is invalid: %o',
        record
      );
      return;
    }
    const isUiSchemaUpdated = splitKey[2] === 'uischema.json';
    const isSchemaUpdated = splitKey[2] === 'schema.json';

    if (record.deleted) {
      let documentSchema = await models.DocumentSchema.get(
        {
          name: splitKey[0],
          type: splitKey[1] as DocumentSchemaType['type'],
        },
        {
          throw: false,
        }
      );
      if (!documentSchema) {
        this.logger.info(
          `[EventService.processMessage] ignoring the message because the document schema to delete doesn't exist: %o`,
          record
        );
        return;
      }
      await models.DocumentSchema.update({
        name: splitKey[0],
        type: splitKey[1] as DocumentSchemaType['type'],
        ...(isUiSchemaUpdated
          ? {
              uiSchemaPath: '',
            }
          : {}),
        ...(isSchemaUpdated
          ? {
              schemaPath: '',
            }
          : {}),
      });

      // Delete the entry if both schema and uiSchema are removed
      documentSchema = await models.DocumentSchema.get({
        name: splitKey[0],
        type: splitKey[1] as DocumentSchemaType['type'],
      });
      if (!documentSchema.schemaPath && !documentSchema.uiSchemaPath) {
        await models.DocumentSchema.remove({
          name: splitKey[0],
          type: splitKey[1] as DocumentSchemaType['type'],
        });
      }
    } else {
      // create if doesn't exist already or update it
      await models.DocumentSchema.update(
        {
          name: splitKey[0],
          type: splitKey[1] as DocumentSchemaType['type'],
          ...(isUiSchemaUpdated
            ? {
                uiSchemaPath: record.objectKey,
              }
            : {}),
          ...(isSchemaUpdated
            ? {
                schemaPath: record.objectKey,
              }
            : {}),
        },
        {
          exists: null,
        }
      );
    }
    this.logger.info(
      '[EventService.processMessage] processed message successfully : %o',
      record
    );
  }

  public mapToS3Events(event: SQSEvent): S3Event[] {
    const records: S3Event[] = [];
    event?.Records?.forEach((record) => {
      const bucketNotificationEvent: BucketNotificationEvent = JSON.parse(
        record.body
      );
      bucketNotificationEvent?.Records?.forEach((record) => {
        if (record.eventSource === 'aws:s3') {
          const isDeleted = record.eventName.startsWith('ObjectRemoved');
          records.push(
            new S3Event(record.s3.bucket.name, record.s3.object.key, isDeleted)
          );
        }
      });
    });
    return records;
  }
}
