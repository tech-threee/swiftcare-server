import { NextFunction, Response, Request } from 'express';
import { IPatient } from '../../../interfaces/patient.interface';
import PatientSchema from '../schema';
import ResponseHandler from '../../../handlers/response.handler';
import ApiError from '../../../utils/apiError';
import NewPatientAccountTemplate from '../../../services/mail/templates/new_patient_account.template';
import { SendEmail } from '../../../services/mail';
export const Signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: IPatient = req.body;

    const pid = new Date().getTime().toString();

    const patientWithPhoneExist = await PatientSchema.patientWithPropExists({
      phone: payload.phone,
    });
    const patientWithEmailExist = await PatientSchema.patientWithPropExists({
      email: payload.email,
    });

    if (patientWithEmailExist || patientWithPhoneExist)
      return next(new ApiError('Patient Already Exist'));

    const newPatient = await PatientSchema.addSingle({
      ...payload,
      pid,
    });

    // send user email
    const messageTemplate = NewPatientAccountTemplate({
      name: payload.name,
      email: payload.email,
      id: pid,
    });

    new ResponseHandler(res).successWithData(newPatient);
    await SendEmail({
      email: payload.email,
      subject: 'Welcome to SwiftCare Connect',
      message: messageTemplate,
    });
  } catch (error) {
    next(error);
  }
};
