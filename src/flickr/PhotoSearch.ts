// Internal.
import { Photo } from './Photo';
import * as Types from './types';

// Code.
export class PhotoSearch {
  readonly page: number;
  readonly pages: number;
  readonly perpage: number;
  readonly total: number;
  readonly photo: Array<Photo>;

  static create(input: unknown): PhotoSearch | Error {
    if (isPhotoSearch(input)) {
      const { photo, ...other } = input;
      const safePhoto: Array<Photo> = [];

      for (const photoItem of photo) {
        const maybePhoto = Photo.create(Photo.parse(photoItem));
        if (maybePhoto instanceof Error) {
          return maybePhoto;
        }
        safePhoto.push(maybePhoto);
      }

      return new PhotoSearch({ ...other, photo: safePhoto });
    }

    const errMsg = isSafePhotoSearch(input).errMsg;
    return new Error(`ValidationError: ${errMsg}`);
  }

  static parse(input: Types.KeyValue): Types.KeyValue {
    let { page, pages, perpage, total } = input;
    return {
      ...input,
      page: Number(page),
      pages: Number(pages),
      perpage: Number(perpage),
      ptotalage: Number(total),
    };
  }

  private constructor(input: CreatePhotoSearchInput) {
    this.page = input.page;
    this.pages = input.pages;
    this.perpage = input.perpage;
    this.total = input.total;
    this.photo = input.photo;
  }
}

export const PHOTO_SEARCH_PROPS = [
  'page',
  'pages',
  'perpage',
  'total',
  'photo',
];

export const isPhotoSearch = (
  input: unknown
): input is CreatePhotoSearchInput => {
  return isSafePhotoSearch(input).isSafe;
};

export const isSafePhotoSearch = (input: unknown): Types.IsSafe => {
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

  for (const key of PHOTO_SEARCH_PROPS) {
    if (!input.hasOwnProperty(key)) {
      return {
        isSafe: false,
        errMsg: `Expected all input properties to be set, missing ${key}.`,
      };
    }
  }

  const { page, pages, perpage, total } = input as {
    page: unknown;
    pages: unknown;
    perpage: unknown;
    total: unknown;
  };

  const numbers = { page, pages, perpage, total };

  for (const [key, value] of Object.entries(numbers)) {
    if (typeof value !== 'number' || value === NaN) {
      return {
        isSafe: false,
        errMsg: `Expected type of input.${key} to be number, got ${typeof value}.`,
      };
    }
  }

  return {
    isSafe: true,
    errMsg: '',
  };
};

export interface CreatePhotoSearchInput {
  readonly page: number;
  readonly pages: number;
  readonly perpage: number;
  readonly total: number;
  readonly photo: Array<Photo>;
}
