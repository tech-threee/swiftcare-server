import { NextFunction, Request, Response } from 'express';

import { HttpStatus } from '../handlers/handler.util';
import ResponseHandler from '../handlers/response.handler';
import ApiError from '../utils/apiError';

// Not Found Error handler
const NotFoundErrorHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const message = 'Resource not found';
  const statusCode = HttpStatus.NotFound;
  const error: ApiError = new Error(message);
  error.stack = res.req?.originalUrl;
  error.statusCode = statusCode;

  return new ResponseHandler(res).error(new ApiError(message, statusCode));
};

export default NotFoundErrorHandler;
