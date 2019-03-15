// Packages.
import * as debug from 'debug';
import * as AWS from 'aws-sdk';

// Code.
const debugVerbose = debug('eratosthenes:verbose:drivers:s3');

export class S3Driver {
  static client = new AWS.S3();

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async getObject(
    request: AWS.S3.GetObjectRequest
  ): Promise<AWS.S3.GetObjectOutput> {
    debugVerbose(`getObject input: %j`, request);
    const response = await this.client.getObject(request).promise();
    debugVerbose(`getObject response: %j`, response);
    return response;
  }

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async putObject(
    request: AWS.S3.PutObjectRequest
  ): Promise<AWS.S3.PutObjectOutput> {
    debugVerbose(`putObject input: %j`, request);
    const response = await this.client.putObject(request).promise();
    debugVerbose(`putObject response: %j`, response);
    return response;
  }
}
