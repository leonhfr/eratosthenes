// Packages.
import * as debug from 'debug';
import * as AWS from 'aws-sdk';

// Code.
const debugVerbose = debug('eratosthenes:verbose:drivers:lambda');

export class Lambda {
  static client = new AWS.Lambda();

  // ignoring wrapping function
  /*istanbul ignore next*/
  static async invoke(
    request: AWS.Lambda.InvocationRequest
  ): Promise<AWS.Lambda.InvocationResponse> {
    debugVerbose(`invoke input: %j`, request);
    const response = await this.client.invoke(request).promise();
    debugVerbose(`invoke response: %j`, response);
    return response;
  }
}
