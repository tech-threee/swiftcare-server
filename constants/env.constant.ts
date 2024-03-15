import 'dotenv/config';

import AppConstants from './app.constant';

export default class EnvConstants {
  // server
  static readonly PORT = Number(process.env.PORT ?? 5000);
  static readonly NODE_ENV = process.env.NODE_ENV ?? AppConstants.DEVELOPMENT;

  // database
  static readonly MONGO_URI_PRO = process.env.MONGO_URI_PRO ?? '';
  static readonly MONGO_URI_TEST = process.env.MONGO_URI_TEST ?? '';
  static readonly MONGO_URI_DEV = process.env.MONGO_URI_DEV ?? '';

  // firebase
  static readonly FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
  static readonly FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN;
  static readonly FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
  static readonly FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
  static readonly FIREBASE_MESSAGING_SENDER_ID =
    process.env.FIREBASE_MESSAGING_SENDER_ID;
  static readonly FIREBASE_APP_ID = process.env.FIREBASE_APP_ID;

  // jwt
  static readonly JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? '';
  static readonly JWT_ACCESS_EXPIRATION =
    process.env.JWT_ACCESS_EXPIRATION ?? '30m';
  static readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? '';
  static readonly JWT_REFRESH_EXPIRATION =
    process.env.JWT_REFRESH_EXPIRATION ?? '30d';
  static readonly JWT_EMAIL_VERIFICATION_SECRET =
    process.env.JWT_EMAIL_VERIFICATION_SECRET ?? '';

  // email
  static readonly EMAIL_NAME = process.env.EMAIL_NAME;
  static readonly EMAIL_SENDER = process.env.EMAIL_SENDER;
  static readonly EMAIL_ID = process.env.EMAIL_ID;
  static readonly EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

  static isDev() {
    return EnvConstants.NODE_ENV === AppConstants.DEVELOPMENT;
  }

  static isProd() {
    return EnvConstants.NODE_ENV === AppConstants.PRODUCTION;
  }

  static isTest() {
    return EnvConstants.NODE_ENV === AppConstants.TEST;
  }
}
