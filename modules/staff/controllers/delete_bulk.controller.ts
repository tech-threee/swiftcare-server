import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';
import { CastToId, IsValidId } from '../../../utils/functions';
import StaffSchema from '../schema';

export default async function DeleteBulkStaff(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let StaffIds = req.body.ids as string[];

    for (const id of StaffIds) {
      if (!IsValidId(id)) {
        return new ResponseHandler(res).failure(
          `This Staff ID is invalid: ${id}`,
        );
      }
    }

    await StaffSchema.deleteBulk(StaffIds?.map((id) => CastToId(id)));

    return new ResponseHandler(res).success('Staff deleted successfully');
  } catch (error) {
    return next(error);
  }
}
