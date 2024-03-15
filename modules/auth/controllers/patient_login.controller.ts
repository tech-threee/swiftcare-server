import { NextFunction, Request, Response } from 'express';

import AppConstants from '../../../constants/app.constant';
import ResponseHandler from '../../../handlers/response.handler';
import { LoginAuth, MODULES_KEY, PatientLoginAuth } from '../../../interfaces/login.interface';
import PatientSchema from '../../patient/schema';
import AuthSchema from '../schema';
import PatientOtpTemplate from '../../../services/mail/templates/patient_otp.template';
import { SendEmail } from '../../../services/mail';

export async function PatientLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload: PatientLoginAuth = req.body;

    const isExistingPatientId = await PatientSchema.getPatientWithProp({
      email: payload.email,
    });
    if (!isExistingPatientId) {
      return new ResponseHandler(res).failure('Patient not Fount');
    }


    const PIN = await AuthSchema.PatientRequestOtp(
      payload
    );

    // send user email
    const messageTemplate = PatientOtpTemplate({
      otp: PIN,
    });

    SendEmail({
      email: payload.email,
      subject: 'Swiftcare Login OTP',
      message: messageTemplate,
    });


    return new ResponseHandler(res).successWithData({
      ...payload
    })
  } catch (error) {
    return next(error);
  }
}

export async function PatientVeirfyOtp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payload: PatientLoginAuth = req.body;

    const isExistingPatientId = await PatientSchema.getPatientWithProp({
      email: payload.email,
    });
    if (!isExistingPatientId) {
      return new ResponseHandler(res).failure('Patient not Fount');
    }


    await AuthSchema.authenticatePatient(
      payload
    );


    return new ResponseHandler(res).successWithData({
      ...payload
    })
  } catch (error) {
    return next(error);
  }
}
