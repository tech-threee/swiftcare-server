import mongoose from 'mongoose';

import EnvConstants from '../constants/env.constant';

// Fix deprecation warning
mongoose.set('strictQuery', false);

// Log database actions during test and development
mongoose.set('debug', EnvConstants.isDev() || EnvConstants.isTest());

export const MONGO_URI = () => {
  return (
    {
      development: EnvConstants.MONGO_URI_DEV,
      production: EnvConstants.MONGO_URI_PRO,
      test: EnvConstants.MONGO_URI_TEST,
    }[EnvConstants.NODE_ENV] ?? EnvConstants.MONGO_URI_DEV
  );
};

const DBCONNECT = async (callback: () => void) => {
  const URI = MONGO_URI() as string;

  try {
    mongoose.connect(URI, {
      autoIndex: true,
    });
    // check if database is connected
    console.log(
      `Database connected in ${EnvConstants.NODE_ENV.toUpperCase()} mode 🚀`,
    );

    // check if database is disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('Database disconnected');
    });

    // Run callback function
    callback();
  } catch (error) {
    console.log(error);
    throw new Error('Error connecting to database');
  }
};

export default DBCONNECT;
