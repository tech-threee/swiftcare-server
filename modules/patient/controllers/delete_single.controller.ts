import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';
import { CastToId, IsValidId } from '../../../utils/functions';
import PatientSchema from '../schema';

export default async function DeleteSingle(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const PatientId = req.params.id as string;

    if (!IsValidId(PatientId)) {
      return new ResponseHandler(res);
    }

    await PatientSchema.deleteSingle(CastToId(PatientId));

    return new ResponseHandler(res).success('Patient deleted successfully');
  } catch (error) {
    return next(error);
  }
}
