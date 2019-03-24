// Packages.
import * as AWSLambda from 'aws-lambda';
import * as debug from 'debug';
import { Job } from '@scenicroutes/wittgenstein';

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

    debugVerbose(`testing Job`);

    const job = Job.create(createMockJob()) as Job;

    debugVerbose(`job: %o`, job);

    const putResponse = await Eratosthenes.JobModel.put(job);

    debugVerbose(`putResponse: %o`, putResponse);

    const listResponse = await Eratosthenes.JobModel.list(10);

    debugVerbose(`listResponse: %o`, listResponse);

    const deleteResponse = await Eratosthenes.JobModel.delete(job.id);

    debugVerbose(`deleteResponse: %o`, deleteResponse);

    const url = `https://sqs.${process.env.REGION}.amazonaws.com/${
      process.env.ACCOUNT
    }/job-scheduling`;

    const publishResponse = await Eratosthenes.JobModel.publish(url, [job]);

    debugVerbose(`publishResponse: %o`, publishResponse);

    return callback(undefined, 'Done');
  } catch (err) {
    debugError(err);
    return callback(err, 'Error');
  }
};

export const createMockJob = () => ({
  id: '7debb0f5-e53a-4df4-8c43-c96db89084f1',
  minUploadDate: 0,
  maxUploadDate: 100000,
  page: 1,
  zone: createMockZone(),
});

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
