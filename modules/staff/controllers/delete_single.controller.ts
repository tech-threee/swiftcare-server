import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';
import { CastToId, IsValidId } from '../../../utils/functions';
import StaffSchema from '../schema';

export default async function DeleteSingleStaff(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const StaffId = req.params.id as string;

    if (!IsValidId(StaffId)) {
      return new ResponseHandler(res);
    }

    await StaffSchema.deleteSingle(CastToId(StaffId));

    return new ResponseHandler(res).success('Staff deleted successfully');
  } catch (error) {
    return next(error);
  }
}
