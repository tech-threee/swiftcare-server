import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';
import { IPatient, IPatientSchema } from '../../../interfaces/patient.interface';
import { CastToId, IsValidId } from '../../../utils/functions';
import PatientSchema from '../schema';

// this is part of the add Staff controller below but the file is uploaded
// before the other data is processed. So if there is an error with the data,
// the file is already uploaded but not inserted
export async function ProcessUpdateData(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload: IPatient = req.body;
    const StaffId = req.params.id as string;

    if (!IsValidId(StaffId)) {
      return new ResponseHandler(res);
    }

    const Staff = await PatientSchema.fetchSingleById(CastToId(StaffId));

    if (!Staff) {
      return new ResponseHandler(res).failure('Staff not found');
    }

    const isTakenStaffId = await PatientSchema.patientWithPropExists(
      { sid: payload.pid },
    );
    if (isTakenStaffId && Staff.pid !== payload.pid) {
      return new ResponseHandler(res).failure('Staff ID is already taken');
    }

    const isTakenEmail = await PatientSchema.patientWithPropExists({ email: payload.email });
    if (isTakenEmail && Staff.email !== payload.email) {
      return new ResponseHandler(res).failure('Email is already used');
    }

    const isTakenPhone = await PatientSchema.patientWithPropExists({ phone: payload.phone });
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

export default async function UpdateStaff(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {


    const payload: IPatientSchema = req.payload;

    // File's image url
    // @ts-expect-error
    const downloadURL = req.image ?? '';

    await PatientSchema.updateByID(payload._id, {
      ...payload,
      image: downloadURL,
    });

    return new ResponseHandler(res).success('Staff updated successfully');
  } catch (error) {
    return next(error);
  }
}
