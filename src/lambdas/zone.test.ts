// Packages.
import * as AWSLambda from 'aws-lambda';
import * as debug from 'debug';
import { Zone } from '@scenicroutes/wittgenstein';

// Internal.
import { Eratosthenes } from '../index';

// Code.
const debugError = debug('eratosthenes:error:test');
const debugVerbose = debug('eratosthenes:verbose:test');

export const main = async (
  event: AWSLambda.ScheduledEvent,
  context: AWSLambda.Context,
  callback: AWSLambda.Callback
) => {
  try {
    debugVerbose(`event: %j`, event);
    debugVerbose(`context: %j`, context);

    debugVerbose(`testing Zone`);

    const zone = Zone.create(createMockZone()) as Zone;

    debugVerbose(`zone: %o`, zone);

    const putResponse = await Eratosthenes.ZoneModel.put(zone);

    debugVerbose(`putResponse: %o`, putResponse);

    const queryResponse = await Eratosthenes.ZoneModel.query(
      '8ea8f412-4ee8-4f1d-9228-4c133b8fbd37'
    );

    debugVerbose(`queryResponse: %o`, queryResponse);

    debugVerbose(`DON'T FORGET TO DELETE THE ZONE IN DYNAMODB`);

    return callback(undefined, 'Done');
  } catch (err) {
    debugError(err);
    return callback(err, 'Error');
  }
};

export const createMockZone = () => ({
  id: '4ab7068b-6c6c-46d2-8009-1d7d1ab35a3b',
  area: '8ea8f412-4ee8-4f1d-9228-4c133b8fbd37',
  bbox: [2.18, 41.4, 2.19, 41.5],
  zone: {
    geometry: {
      coordinates: [[[2.18, 41.4], [2.19, 41.5], [2.19, 41.4], [2.18, 41.4]]],
      type: 'Polygon',
    },
    properties: {},
    type: 'Feature',
  },
});
