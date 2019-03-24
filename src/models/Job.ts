// Packages.
import * as AWS from 'aws-sdk';
import * as debug from 'debug';
import { Job } from '@scenicroutes/wittgenstein';

// Internal.
import { DynamoDB } from '../clients';
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

  static async put() {
    // Put job
  }

  static async delete() {
    // Delete job
  }

  static async publish() {
    // publish job to sqs
  }

  static async consume() {
    // consume job from sqs
  }
}
