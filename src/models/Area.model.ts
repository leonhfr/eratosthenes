// Packages.
import * as AWS from 'aws-sdk';
import * as debug from 'debug';
import { Area } from '@scenicroutes/wittgenstein';
import * as turfHelpers from '@turf/helpers';
import * as turfInvariant from '@turf/invariant';

// Internal.
import { BUCKET_GEOJSON } from '../constants';
import { DynamoDB, S3 } from '../clients';
import * as Types from '../types';

// Code.
const debugError = debug('eratosthenes:error:area');
const debugVerbose = debug('eratosthenes:verbose:area');

export class AreaModel {
  static async list(): Promise<Types.Result<Area, Error> | Error> {
    const request: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: 'area',
    };
    debugVerbose(`list: requesting %o`, request);

    const ok: Array<Area> = [];
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
        const maybeArea = Area.create(item);

        maybeArea instanceof Error ? err.push(maybeArea) : ok.push(maybeArea);
      }

      return { ok, err };
    } catch (err) {
      debugError(`list failed: %s`, err.message);
      return err;
    }
  }

  static async updateItem() {
    // TODO: implement updateItem
  }

  static async getAreaGeojson(
    file: string
  ): Promise<turfHelpers.Feature<turfHelpers.Polygon> | Error> {
    const request: AWS.S3.GetObjectRequest = {
      Key: `${file}.geo.json`,
      Bucket: BUCKET_GEOJSON,
    };

    debugVerbose(`getAreaGeojson: requesting %o`, request);

    try {
      const response = await S3.getObject(request).promise();
      debugVerbose(`getAreaGeojson: response %o`, response);

      if (!response.Body) {
        throw new Error('response.Body is undefined');
      }

      const areaGeojson = JSON.parse(response.Body.toString());

      turfInvariant.featureOf(
        areaGeojson as turfHelpers.Feature<any>,
        'Polygon',
        'callingFunction'
      );

      return areaGeojson as turfHelpers.Feature<turfHelpers.Polygon>;
    } catch (err) {
      debugError(`getAreaGeojson failed: %s`, err.message);
      return err;
    }
  }
}
