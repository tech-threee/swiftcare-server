import { NextFunction, Request, Response } from 'express';

import AppConstants from '../constants/app.constant';
import ResponseHandler from '../handlers/response.handler';

export default function ValidationMiddleware(
  schema: any,
  property: string = AppConstants.REQUEST_TYPE.BODY,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const options = {
      abortEarly: true, // include all errors
      allowUnknown: false, // ignore unknown props
      convert: true,
    };

    // @ts-ignore
    const { error } = schema.validate(req[property], options);

    if (!error) {
      return next();
    }

    const messages = error.details.map((err: any) => err.message).join(',');
    return new ResponseHandler(res).failure(messages);
  };
}
