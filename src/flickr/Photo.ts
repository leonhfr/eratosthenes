// Internal.
import * as Types from './types';

// Code.
export class Photo {
  readonly id: string;
  readonly owner: string;
  readonly secret: string;
  readonly server: string;
  readonly farm: number;
  readonly title: string;
  readonly description: string;
  readonly ownername: string;
  readonly views: number;
  readonly tags: Array<string>;
  readonly latitude: number;
  readonly longitude: number;
  readonly context: number;

  static create(input: unknown): Photo | Error {
    if (isPhoto(input)) {
      return new Photo(input);
    }
    const errMsg = isSafePhoto(input).errMsg;
    return new Error(`ValidationError: ${errMsg}`);
  }

  static parse(input: Types.KeyValue): Types.KeyValue {
    let { description, tags } = input;

    if (description && description._content) {
      description = description._content;
    }

    if (tags && typeof tags === 'string') {
      tags = tags.split(' ');
    }

    return { ...input, description, tags };
  }

  private constructor(input: CreatePhotoInput) {
    this.id = input.id;
    this.owner = input.owner;
    this.secret = input.secret;
    this.server = input.server;
    this.farm = input.farm;
    this.title = input.title;
    this.description = input.description;
    this.ownername = input.ownername;
    this.views = input.views;
    this.tags = input.tags;
    this.latitude = input.latitude;
    this.longitude = input.longitude;
    this.context = input.context;
  }
}

export const PHOTO_PROPS = [
  'id',
  'owner',
  'secret',
  'server',
  'farm',
  'title',
  'description',
  'ownername',
  'views',
  'tags',
  'latitude',
  'longitude',
  'context',
];

export const isPhoto = (input: unknown): input is CreatePhotoInput => {
  return isSafePhoto(input).isSafe;
};

export const isSafePhoto = (input: unknown): Types.IsSafe => {
  if (typeof input !== 'object') {
    return {
      isSafe: false,
      errMsg: `Expected type of input to be object, got ${typeof input}.`,
    };
  }

  if (input === null) {
    return {
      isSafe: false,
      errMsg: `Expected input not to be null.`,
    };
  }

  for (const key of PHOTO_PROPS) {
    if (!input.hasOwnProperty(key)) {
      return {
        isSafe: false,
        errMsg: `Expected all input properties to be set, missing ${key}.`,
      };
    }
  }

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
  } = input as {
    id: unknown;
    owner: unknown;
    secret: unknown;
    server: unknown;
    farm: unknown;
    title: unknown;
    description: unknown;
    ownername: unknown;
    views: unknown;
    tags: unknown;
    latitude: unknown;
    longitude: unknown;
    context: unknown;
  };

  const numbers = { farm, views, latitude, longitude, context };

  const strings = { id, owner, secret, server, title, description, ownername };

  const stringArrays = { tags };

  // Numbers

  for (const [key, value] of Object.entries(numbers)) {
    if (typeof value !== 'number') {
      return {
        isSafe: false,
        errMsg: `Expected type of input.${key} to be number, got ${typeof value}.`,
      };
    }
  }

  // Strings

  for (const [key, value] of Object.entries(strings)) {
    if (typeof value !== 'string') {
      return {
        isSafe: false,
        errMsg: `Expected type of input.${key} to be string, got ${typeof value}.`,
      };
    }
  }

  // Array<string>

  for (const [key, value] of Object.entries(stringArrays)) {
    if (!Array.isArray(value)) {
      return {
        isSafe: false,
        errMsg: `Expected type of input.${key} to be array, got ${typeof value}.`,
      };
    }

    for (const item of value) {
      if (typeof item !== 'string') {
        return {
          isSafe: false,
          errMsg: `Expected type of input.${key} elements to be string, got ${typeof item} for one of them.`,
        };
      }
    }
  }

  return {
    isSafe: true,
    errMsg: '',
  };
};

export interface CreatePhotoInput {
  readonly id: string;
  readonly owner: string;
  readonly secret: string;
  readonly server: string;
  readonly farm: number;
  readonly title: string;
  readonly description: string;
  readonly ownername: string;
  readonly views: number;
  readonly tags: Array<string>;
  readonly latitude: number;
  readonly longitude: number;
  readonly context: number;
}
