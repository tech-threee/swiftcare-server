import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

import { HttpStatus } from '../handlers/handler.util';
import ResponseHandler from '../handlers/response.handler';
import ApiError from '../utils/apiError';

const Errorhandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // jwt error is caught as 505 instead of 401
  if (err instanceof TokenExpiredError) {
    return new ResponseHandler(res).error(
      new ApiError(
        'Authentication token has expired. Please log in again.',
        HttpStatus.AccessDenied,
      ),
    );
  }

  const message = err.message ?? 'Something went wrong';
  const statusCode = err.statusCode ?? HttpStatus.InternalServerError;

  return new ResponseHandler(res).error(new ApiError(message, statusCode));
};

export default Errorhandler;
