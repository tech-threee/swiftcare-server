import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { ErrorHandler, NotFoundErrorHandler } from '../middlewares';

import ROUTES from '../routes';

declare module 'express-serve-static-core' {
  interface Request {
    course: any;
    relation: any;
    user: any;
    payload: any;
    staff: any


  }
}

const CreateServer = (): express.Application => {
  dotenv.config();
  // init APP
  const APP = express();
  APP.use(cookieParser());
  APP.use(express.json());
  APP.use(cors({ credentials: true, origin: true }));

  // Routes
  APP.use(`/api/v1`, ROUTES);

  // Error Handler middleware

  APP.use(ErrorHandler);

  APP.use(NotFoundErrorHandler);

  return APP;
};

export default CreateServer;
