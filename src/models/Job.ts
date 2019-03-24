// Packages.
import * as AWSLambda from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as debug from 'debug';
import { Job } from '@scenicroutes/wittgenstein';

// Internal.
import { DynamoDB, Sqs } from '../clients';
import * as Types from '../types';

// Code.
const debugError = debug('eratosthenes:error:job');
const debugVerbose = debug('eratosthenes:verbose:job');

export class JobModel {
  static async list(
    limit: number = 100
  ): Promise<Types.Result<Job, Error> | Error> {
    const request: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: 'job',
      Limit: limit,
    };
    debugVerbose(`list: requesting %o`, request);

    const ok: Array<Job> = [];
    const err: Array<Error> = [];

    try {
      const response: AWS.DynamoDB.DocumentClient.ScanOutput = await DynamoDB.scan(
        request
      ).promise();

      debugVerbose(`list: response %o`, response);

      if (!response.Items) {
        return { ok, err };
      }

      for (const item of response.Items) {
        const maybeJob = Job.create(item);

        maybeJob instanceof Error ? err.push(maybeJob) : ok.push(maybeJob);
      }

      return { ok, err };
    } catch (err) {
      debugError(`list failed: %s`, err.message);
      return err;
    }
  }

  static async put(
    job: Job
  ): Promise<AWS.DynamoDB.AttributeMap | undefined | Error> {
    const zoneMap = JSON.parse(JSON.stringify(job.zone));

    const request: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: 'job',
      Item: {
        id: job.id,
        minUploadDate: job.minUploadDate,
        maxUploadDate: job.maxUploadDate,
        page: job.page,
        zone: zoneMap,
      },
      ReturnValues: 'ALL_OLD',
    };

    debugVerbose(`put: request %o`, request);

    try {
      const response: AWS.DynamoDB.DocumentClient.PutItemOutput = await DynamoDB.put(
        request
      ).promise();
      debugVerbose(`put: response %o`, response);

      return response.Attributes;
    } catch (err) {
      debugError(`put failed: %s`, err.message);
      return err;
    }
  }

  static async delete(
    id: string
  ): Promise<AWS.DynamoDB.AttributeMap | undefined | Error> {
    const request: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: 'job',
      Key: { id },
    };
    debugVerbose(`delete: request %o`, request);

    try {
      const response: AWS.DynamoDB.DocumentClient.DeleteItemOutput = await DynamoDB.delete(
        request
      ).promise();

      debugVerbose(`delete: response %o`, response);

      return response.Attributes;
    } catch (err) {
      debugError(`delete failed: %s`, err.message);
      return err;
    }
  }

  static async publish(
    url: string,
    jobs: Array<Job>
  ): Promise<
    | Types.Result<
        AWS.SQS.SendMessageBatchResultEntry,
        AWS.SQS.BatchResultErrorEntry
      >
    | Error
  > {
    const request: AWS.SQS.SendMessageBatchRequest = {
      QueueUrl: url,
      Entries: jobs.map(job => ({
        Id: job.id,
        MessageBody: JSON.stringify(job),
      })),
    };
    debugVerbose(`publish: request %o`, request);

    try {
      const response: AWS.SQS.SendMessageBatchResult = await Sqs.sendMessageBatch(
        request
      ).promise();

      debugVerbose(`publish: response %o`, response);

      return { ok: response.Successful, err: response.Failed };
    } catch (err) {
      debugError(`publish failed: %s`, err.message);
      return err;
    }
  }

  static consume(event: AWSLambda.SQSEvent): Types.Result<Job, Error> {
    const ok: Array<Job> = [];
    const err: Array<Error> = [];

    for (const record of event.Records) {
      const maybeJob = this.parseRecord(record);
      if (maybeJob instanceof Job) {
        ok.push(maybeJob);
      } else {
        err.push(maybeJob);
      }
    }

    return { ok, err };
  }

  private static parseRecord(record: AWSLambda.SQSRecord): Job | Error {
    try {
      const input = JSON.parse(record.body);
      const { id, minUploadDate, maxUploadDate, page, zone } = input;
      if (id && minUploadDate && maxUploadDate && page && zone) {
        return Job.create({ id, minUploadDate, maxUploadDate, page, zone });
      }
      return new Error(`Cannot parse job: ${record.body}`);
    } catch (err) {
      return err;
    }
  }
}
