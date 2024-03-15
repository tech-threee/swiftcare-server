import { Response } from 'express';

import EnvConstants from '../constants/env.constant';
import ApiError from '../utils/apiError';
import { HttpStatus } from './handler.util';

export default class ResponseHandler {
  constructor(public res: Response) {}

  failure(message: string) {
    return this.res.status(HttpStatus.Success).json({
      success: false,
      message,
    });
  }

  success(message: string) {
    return this.res.status(HttpStatus.Success).json({
      success: true,
      message,
    });
  }

  successWithData<T>(data: T) {
    return this.res.status(HttpStatus.Success).json({
      success: true,
      data,
    });
  }

  error(error: ApiError) {
    return this.res
      .status(error.statusCode ?? HttpStatus.InternalServerError)
      .json({
        success: false,
        message: error.message,
        stack: EnvConstants.isProd() ? null : error.stack,
      });
  }
}
