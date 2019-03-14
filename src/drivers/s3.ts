// Packages.
import * as debug from 'debug';
import * as AWS from 'aws-sdk';

// Code.
const debugVerbose = debug('eratosthenes:verbose:drivers:s3');

const client = new AWS.S3();

export class S3 {
  // ignoring wrapping function
  /*istanbul ignore next*/
  static async getObject(
    request: AWS.S3.GetObjectRequest
  ): Promise<AWS.S3.GetObjectOutput> {
    debugVerbose(`getObject input: %j`, request);
    const response = await client.getObject(request).promise();
    debugVerbose(`getObject response: %j`, response);
    return response;
  }
}
