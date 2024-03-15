import { NextFunction, Request, Response } from 'express';
import LoggedInEmailTemplate from '../../../services/mail/templates/logged_in.template';
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


    const { login, token } = await AuthSchema.authenticatePatient(
      payload
    );

    // send user email
    const messageTemplate = LoggedInEmailTemplate({
      name: isExistingPatientId.name,
      ip:
        req.headers['x-forwarded-for']?.toString() ??
        req.connection.remoteAddress,
      device: req.headers['user-agent']?.toString(),
      location: '',
    });

    SendEmail({
      email: payload.email,
      subject: 'Log In Detected on Your SwiftCare Account',
      message: messageTemplate,
    });


    return new ResponseHandler(res).successWithData({
      ...isExistingPatientId,
      token,
      otp: null
    })
  } catch (error) {
    return next(error);
  }
}
