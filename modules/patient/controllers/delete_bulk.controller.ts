import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';
import { CastToId, IsValidId } from '../../../utils/functions';
import PatientSchema from '../schema';

export default async function DeleteBulk(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let PatientIds = req.body.ids as string[];

    for (const id of PatientIds) {
      if (!IsValidId(id)) {
        return new ResponseHandler(res).failure(
          `This Patient ID is invalid: ${id}`,
        );
      }
    }

    await PatientSchema.deleteBulk(PatientIds?.map((id) => CastToId(id)));

    return new ResponseHandler(res).success('Patient deleted successfully');
  } catch (error) {
    return next(error);
  }
}
