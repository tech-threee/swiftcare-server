import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';
import { CastToId, IsValidId } from '../../../utils/functions';
import PatientSchema from '../schema';

export default async function FetchSingle(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const PatientId = req.params.id as string;

    if (!IsValidId(PatientId)) {
      return new ResponseHandler(res);
    }

    const Patient = await PatientSchema.fetchSingleById(CastToId(PatientId));

    if (!Patient) {
      return new ResponseHandler(res).failure('Patient not found');
    }

    return new ResponseHandler(res).successWithData(Patient);
  } catch (error) {
    return next(error);
  }
}
