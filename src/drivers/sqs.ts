// Packages.
import * as debug from 'debug';
import * as AWS from 'aws-sdk';

// Code.
const debugVerbose = debug('eratosthenes:verbose:drivers:sqs');

const client = new AWS.SQS();

export class SQS {
  // ignoring wrapping function
  /*istanbul ignore next*/
  static async sendMessage(
    request: AWS.SQS.SendMessageRequest
  ): Promise<AWS.SQS.SendMessageResult> {
    debugVerbose(`sendMessage input: %j`, request);
    const response = await client.sendMessage(request).promise();
    debugVerbose(`sendMessage response: %j`, response);
    return response;
  }

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async sendMessageBatch(
    request: AWS.SQS.SendMessageBatchRequest
  ): Promise<AWS.SQS.SendMessageBatchResult> {
    debugVerbose(`sendMessageBatch input: %j`, request);
    const response = await client.sendMessageBatch(request).promise();
    debugVerbose(`sendMessageBatch response: %j`, response);
    return response;
  }
}
