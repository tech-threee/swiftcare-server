import { NextFunction, Request, Response } from 'express';

import AppConstants from '../../../constants/app.constant';
import ResponseHandler from '../../../handlers/response.handler';
import { LoginAuth, MODULES_KEY } from '../../../interfaces/login.interface';
import { SendEmail } from '../../../services/mail';
import LoggedInEmailTemplate from '../../../services/mail/templates/logged_in.template';
import StaffSchema from '../../staff/schema';
import AuthSchema from '../schema';

export default async function StaffLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload: LoginAuth = req.body;

    const isExistingStaffId = await StaffSchema.isExistingStaffID(
      payload.sid,
    );
    if (!isExistingStaffId) {
      return new ResponseHandler(res).failure('Staff ID not found');
    }

    const isStaffIdHasLoginRow = await AuthSchema.isExistingSid(
      payload.sid,
    );
    if (!isStaffIdHasLoginRow) {
      return new ResponseHandler(res).failure(
        'Staff ID not found, contact support for assistance',
      );
    }

    const responseDate = await AuthSchema.authenticate(
      payload,
      AppConstants.ROLES.STAFF as MODULES_KEY,
    );

    const user = await StaffSchema.fetchBySid(payload.sid);

    // send user email
    const messageTemplate = LoggedInEmailTemplate({
      name: user.name,
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
