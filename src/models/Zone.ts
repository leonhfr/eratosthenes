// Packages.
import * as AWS from 'aws-sdk';
import * as debug from 'debug';
import { Zone } from '@scenicroutes/wittgenstein';

// Internal.
import { DynamoDB } from '../clients';
// import * as Types from '../types';

// Code.
const debugError = debug('eratosthenes:error:zone');
const debugVerbose = debug('eratosthenes:verbose:zone');

export class ZoneModel {
  static async list() {}

  static async put(
    zone: Zone
  ): Promise<AWS.DynamoDB.AttributeMap | undefined | Error> {
    const request: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: 'area',
      Item: {
        id: { S: zone.id },
        area: { S: zone.area },
        bbox: { S: JSON.stringify(zone.bbox) },
        zone: { S: zone.zone ? JSON.stringify(zone.zone) : '' },
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
}
