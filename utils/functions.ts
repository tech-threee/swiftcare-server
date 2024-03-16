import crypto from 'crypto';
import mongoose from 'mongoose';

export const getPaginationParams = (
  count: number,
  pageNumber: number,
  pageSize: number,
) => {
  return {
    pageNumber: pageNumber * pageSize < count ? pageNumber + 1 : 1,
    pageSize: pageSize <= count ? pageSize : count > 100 ? 100 : count,
    totalCount: count,
  };
};

// Passed directly from the request query
export const setPaginationParams = (pageNumber?: string, pageSize?: string) => {
  let _pageNumber = Number(pageNumber) || 1;

  if (_pageNumber < 1) {
    _pageNumber = 1;
  }

  let _pageSize = Number(pageSize) || 10;

  if (_pageSize < 1) {
    _pageSize = 10;
  }

  return { pageNumber: _pageNumber, pageSize: _pageSize };
};

export const generateRandomFilename = (extension: string): string => {
  const randomBytes = crypto.randomBytes(16);
  const randomHex = randomBytes.toString('hex');

  return `${randomHex}${extension}`;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const IsValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const CastToId = (id: string) => new mongoose.Types.ObjectId(id);

// returns the first starting 15 words
export const GetTopicFromText = (text: string) =>
  text.split(' ').splice(0, 15).join(' ');

export const EncodeBase64 = (plainString: string): string => {
  return Buffer.from(plainString, 'utf8').toString('base64');
};

export const DecodeBase64 = (encodedString: string): string => {
  return Buffer.from(encodedString, 'base64').toString('utf-8');
};

export const generateRandomHexColor = (): string => {
  const getRandomHexDigit = () => Math.floor(Math.random() * 16).toString(16);

  let color: string;
  do {
    color = `#${getRandomHexDigit()}${getRandomHexDigit()}${getRandomHexDigit()}${getRandomHexDigit()}${getRandomHexDigit()}${getRandomHexDigit()}`;
  } while (color === '#000000' || color === '#FFFFFF');

  return color;
};
