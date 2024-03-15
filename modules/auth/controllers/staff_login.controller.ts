import { NextFunction, Request, Response } from 'express';

import AppConstants from '../../../constants/app.constant';
import ResponseHandler from '../../../handlers/response.handler';
import { LoginAuth, MODULES_KEY } from '../../../interfaces/login.interface';
import { SendEmail } from '../../../services/mail';
import LoggedInEmailTemplate from '../../../services/mail/templates/logged_in.template';
import LecturerSchema from '../../general/lecturer/schema';
import AuthSchema from '../schema';

export default async function LecturerLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload: LoginAuth = req.body;

    const isExistingStaffId = await LecturerSchema.isExistingStaffID(
      payload.academicId,
    );
    if (!isExistingStaffId) {
      return new ResponseHandler(res).failure('Staff ID not found');
    }

    const isStaffIdHasLoginRow = await AuthSchema.isExistingAcademicId(
      payload.academicId,
    );
    if (!isStaffIdHasLoginRow) {
      return new ResponseHandler(res).failure(
        'Staff ID not found, contact support for assistance',
      );
    }

    const responseDate = await AuthSchema.authenticate(
      payload,
      AppConstants.MODULES.LECTURER as MODULES_KEY,
    );

    const user = await LecturerSchema.fetchByAcademicId(payload.academicId);

    // send user email
    const messageTemplate = LoggedInEmailTemplate({
      name: user.surname,
      ip:
        req.headers['x-forwarded-for']?.toString() ??
        req.connection.remoteAddress,
      device: req.headers['user-agent']?.toString(),
      location: '',
    });

    SendEmail({
      email: user.email,
      subject: 'Log In Detected on Your SwiftCare Account',
      message: messageTemplate,
    });

    return new ResponseHandler(res).successWithData({
      responseDate,
      user: user,
    });
  } catch (error) {
    return next(error);
  }
}
