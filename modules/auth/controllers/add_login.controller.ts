import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';
import { LoginRow } from '../../../interfaces/login.interface';
import { SendEmail } from '../../../services/mail';
import NewAccountTemplate from '../../../services/mail/templates/new_account.template';
import { BcryptPassword } from '../../../utils/auth';
import AuthSchema from '../schema';
import { StaffRecord } from '../../../interfaces/staff.interface';

export default async function AddLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {

    const payload: LoginRow = req.payload;
    const staff: StaffRecord = req.staff

    const { PIN, HashedPIN } = await BcryptPassword();

    await AuthSchema.add({ ...payload, pin: HashedPIN });

    // send user email
    const messageTemplate = NewAccountTemplate({
      name: staff.name,
      email: staff.email,
      pin: PIN,
    });

    SendEmail({
      email: staff.email,
      subject: 'Log In Details for Your New SwiftCare Account',
      message: messageTemplate,
    });

    return new ResponseHandler(res).success('Email sent successfully');
  } catch (error) {
    next(error);
  }
}

// ? params: req.payload: extends LoginRow, email, name
export async function AddBulkLogins(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    interface IPayload extends LoginRow {
      name: string;
      email: string;
      HashedPIN: string;
    }
    const staffLogins: IPayload[] = req.payload;

    for (let i = 0; i < staffLogins.length; i++) {
      const { PIN, HashedPIN } = await BcryptPassword();
      staffLogins[i].pin = PIN;
      staffLogins[i].HashedPIN = HashedPIN;
    }

    for (let i = 0; i < staffLogins.length; i++) {
      const { email, name, pin, HashedPIN, ...payload } = staffLogins[i];
      await AuthSchema.add({ ...payload, pin: staffLogins[i].HashedPIN });
    }

    // send user email
    staffLogins.forEach((login) => {
      const messageTemplate = NewAccountTemplate({
        name: login.name,
        email: login.email,
        pin: login.pin,
      });

      SendEmail({
        email: login.email,
        subject: 'Log In Details for Your New SwiftCare Account',
        message: messageTemplate,
      });
    });

    return new ResponseHandler(res).success('Email sent successfully');
  } catch (error) {
    next(error);
  }
}
