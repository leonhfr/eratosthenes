// Packages.
import axios from 'axios';
import * as debug from 'debug';

// Internal.
import { API_ENDPOINT, API_PARAMETERS } from './constants';
import { PhotoSearch } from './PhotoSearch';
import * as Types from './types';

// Code.
const debugError = debug('eratosthenes:error:flickr');
const debugVerbose = debug('eratosthenes:verbose:flickr');

export namespace Flickr {
  export class API {
    static async photosSearch(
      api_key: string,
      searchOptions: Types.FlickrSearchOptions
    ) {
      debugVerbose(
        `requesting photos.search with parameters %o`,
        searchOptions
      );

      const methodParameters = {
        method: 'flickr.photos.search',
        sort: 'date-posted-asc',
        accuracy: 16,
        content_type: 1,
        media: 'photos',
        extras: 'geo,description,owner_name,tags,views,o_dims',
        per_page: 250,
      };

      const parameters = this.makeSafeParameters({
        api_key,
        ...API_PARAMETERS,
        ...methodParameters,
        ...searchOptions,
      });
      const response = await axios.get(API_ENDPOINT, parameters);

      const { data, status, statusText } = response;

      if (status !== 200) {
        debugError(
          `Flickr API answered with %s: %s: %j`,
          status,
          statusText,
          data
        );
        return new Error(`Flickr API answered with ${status}: ${statusText}`);
      }

      debugVerbose(`photos.search answered with: %o`, data);

      const { photos } = data;

      return PhotoSearch.create(PhotoSearch.parse(photos));
    }

    static getSourceUrl(
      id: string,
      size: PhotoSize,
      secret: string,
      serverID: string,
      farmId: string
    ): string {
      // Docs: https://www.flickr.com/services/api/misc.urls.html
      const photo = size.length ? `${id}_${secret}_${size}` : `${id}_${secret}`;
      return `https://farm${farmId}.staticflickr.com/${serverID}/${photo}.jpg`;
    }

    private static makeSafeParameters(
      parameters: Types.RequestParameters
    ): Types.SafeRequestParameters {
      const safeParameters: Types.SafeRequestParameters = {};

      for (const [key, value] of Object.entries(parameters)) {
        if (typeof value === 'string') {
          safeParameters[key] = value;
        } else if (typeof value === 'number') {
          safeParameters[key] = value.toString();
        } else if (Array.isArray(value)) {
          safeParameters[key] = value.join(',');
          // flickr: minimum_longitude, minimum_latitude, maximum_longitude, maximum_latitude
          // turf: extent in minX, minY, maxX, maxY order
        }
      }

      return safeParameters;
    }
  }

  export type SearchOptions = Types.FlickrSearchOptions;

  export enum PhotoSize {
    SmallSquare = 's', // s	small square 75x75
    LargeSquare = 'q', // q	large square 150x150
    Thumbnail = 't', // t	thumbnail, 100 on longest side
    Small240 = 'm', // m	small, 240 on longest side
    Small320 = 'n', // n	small, 320 on longest side
    Medium500 = '', // -	medium, 500 on longest side
    Medium640 = 'z', // z	medium 640, 640 on longest side
  }
}
