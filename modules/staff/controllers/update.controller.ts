import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';
import { IStaff, IStaffSchema } from '../../../interfaces/staff.interface';
import { CastToId, IsValidId } from '../../../utils/functions';
import StaffSchema from '../schema';

// this is part of the add Staff controller below but the file is uploaded
// before the other data is processed. So if there is an error with the data,
// the file is already uploaded but not inserted
export async function ProcessUpdateStaffData(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload: IStaff = req.body;
    const StaffId = req.params.id as string;

    if (!IsValidId(StaffId)) {
      return new ResponseHandler(res);
    }

    const Staff = await StaffSchema.fetchSingleById(CastToId(StaffId));

    if (!Staff) {
      return new ResponseHandler(res).failure('Staff not found');
    }

    const isTakenStaffId = await StaffSchema.isExistingStaffID(
      payload.sid,
    );
    if (isTakenStaffId && Staff.sid !== payload.sid) {
      return new ResponseHandler(res).failure('Staff ID is already taken');
    }

    const isTakenEmail = await StaffSchema.isExistingEmail(payload.email);
    if (isTakenEmail && Staff.email !== payload.email) {
      return new ResponseHandler(res).failure('Email is already used');
    }

    const isTakenPhone = await StaffSchema.isExistingPhone(payload.phone);
    if (isTakenPhone && Staff.phone !== payload.phone) {
      return new ResponseHandler(res).failure('Phone is already used');
    }

    req.payload = { ...payload, _id: req.params.id };
    req.file = req.file;

    return next();
  } catch (error) {
    return next(error);
  }
}

export default async function Update(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {


    const payload: IStaffSchema = req.payload;

    // File's image url
    // @ts-expect-error
    const downloadURL = req.image ?? '';

    await StaffSchema.updateById(payload._id, {
      ...payload,
      image: downloadURL,
    });

    return new ResponseHandler(res).success('Staff updated successfully');
  } catch (error) {
    return next(error);
  }
}
