// Packages.
import * as AWS from 'aws-sdk';
import * as debug from 'debug';
import { Photo } from '@scenicroutes/wittgenstein';

// Internal.
import { DynamoDB } from '../clients';

// Code.
const debugError = debug('eratosthenes:error:area');
const debugVerbose = debug('eratosthenes:verbose:area');

export class PhotoModel {
  static async put(
    photo: Photo
  ): Promise<AWS.DynamoDB.AttributeMap | undefined | Error> {
    const {
      id,
      owner,
      secret,
      server,
      farm,
      title,
      description,
      ownername,
      views,
      tags,
      latitude,
      longitude,
      context,
      zoneId,
      inside,
    } = photo;

    const request: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: 'zone',
      Item: {
        id,
        owner,
        secret,
        server,
        farm,
        title,
        description,
        ownername,
        views,
        tags,
        latitude,
        longitude,
        context,
        zoneId,
        inside,
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
