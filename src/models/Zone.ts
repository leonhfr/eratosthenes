// Packages.
import * as AWS from 'aws-sdk';
import * as debug from 'debug';
import { Zone } from '@scenicroutes/wittgenstein';

// Internal.
import { DynamoDB } from '../clients';
import * as Types from '../types';

// Code.
const debugError = debug('eratosthenes:error:zone');
const debugVerbose = debug('eratosthenes:verbose:zone');

export class ZoneModel {
  static async query(area: string): Promise<Types.Result<Zone, Error> | Error> {
    const request: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: 'zone',
      IndexName: 'area-index',
      KeyConditionExpression: 'area = :v1',
      ExpressionAttributeValues: {
        ':v1': area,
      },
    };
    debugVerbose(`query: requesting %o`, request);

    const ok: Array<Zone> = [];
    const err: Array<Error> = [];

    try {
      const response: AWS.DynamoDB.DocumentClient.QueryOutput = await DynamoDB.query(
        request
      ).promise();

      debugVerbose(`query: response %o`, response);

      if (!response.Items) {
        return { ok, err };
      }

      for (const item of response.Items) {
        const maybeZone = Zone.create(item);

        maybeZone instanceof Error ? err.push(maybeZone) : ok.push(maybeZone);
      }

      return { ok, err };
    } catch (error) {
      debugError(`query failed: %s`, error.message);
      return error;
    }
  }

  static async put(
    zone: Zone
  ): Promise<AWS.DynamoDB.AttributeMap | undefined | Error> {
    const bboxMap = JSON.parse(JSON.stringify(zone.bbox));
    const zoneMap = zone.zone
      ? JSON.parse(JSON.stringify(zone.zone))
      : undefined;

    const request: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: 'zone',
      Item: {
        id: zone.id,
        area: zone.area,
        bbox: bboxMap,
      },
      ReturnValues: 'ALL_OLD',
    };

    if (zoneMap) {
      request.Item.zone = zoneMap;
    }

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
