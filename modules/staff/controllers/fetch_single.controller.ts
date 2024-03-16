import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';
import { CastToId, IsValidId } from '../../../utils/functions';
import StaffSchema from '../schema';

export default async function FetchSingleStaff(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const StaffId = req.params.id as string;

    if (!IsValidId(StaffId)) {
      return new ResponseHandler(res);
    }

    const Staff = await StaffSchema.fetchSingleById(CastToId(StaffId));

    if (!Staff) {
      return new ResponseHandler(res).failure('Staff not found');
    }

    return new ResponseHandler(res).successWithData(Staff);
  } catch (error) {
    return next(error);
  }
}
