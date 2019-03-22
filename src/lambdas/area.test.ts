// Packages.
import * as AWSLambda from 'aws-lambda';
import * as debug from 'debug';

// Internal.
import { Erathostenes } from '../index';

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

    // AREA
    debugVerbose(`testing Area.model`);

    const listResponse = await Erathostenes.AreaModel.list();

    debugVerbose(`list: %o`, listResponse);

    if (!(listResponse instanceof Error) && listResponse.ok.length) {
      const area = listResponse.ok[0];

      const { id, file, lastScheduledAt, zonesComputed } = area;

      const update = await Erathostenes.AreaModel.updateItem(
        id,
        Date.now(),
        !zonesComputed
      );

      debugVerbose(`update: %o`, update);

      const rollback = await Erathostenes.AreaModel.updateItem(
        id,
        lastScheduledAt,
        zonesComputed
      );

      debugVerbose(`rollback: %o`, rollback);

      const geojson = await Erathostenes.AreaModel.getAreaGeojson(file);

      debugVerbose(`geojson: %o`, geojson);
    } else {
      debugError(`cannot continue tests of Area.model`);
    }

    return callback(undefined, 'Done');
  } catch (err) {
    debugError(err);
    return callback(err, 'Error');
  }
};
