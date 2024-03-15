import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';
import { LoginRow } from '../../../interfaces/login.interface';
import { SendEmail } from '../../../services/mail';
import NewAccountTemplate from '../../../services/mail/templates/new_account.template';
import { BcryptPassword } from '../../../utils/auth';
import AuthSchema from '../schema';
import { IStudent } from '../../../interfaces/student.interface';

export default async function AddLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // @ts-expect-error
    const payload: LoginRow = req.loginRow;

    // @ts-expect-error
    const email: string = req.email;

    // @ts-expect-error
    const name: string = req.name;

    const { PIN, HashedPIN } = await BcryptPassword();

    await AuthSchema.add({ ...payload, pin: HashedPIN });

    // send user email
    const messageTemplate = NewAccountTemplate({
      name,
      email,
      pin: PIN,
    });

    SendEmail({
      email,
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
    // @ts-expect-error
    const studentLogins: IPayload[] = req.payload;

    for (let i = 0; i < studentLogins.length; i++) {
      const { PIN, HashedPIN } = await BcryptPassword();
      studentLogins[i].pin = PIN;
      studentLogins[i].HashedPIN = HashedPIN;
    }

    for (let i = 0; i < studentLogins.length; i++) {
      const { email, name, pin, HashedPIN, ...payload } = studentLogins[i];
      await AuthSchema.add({ ...payload, pin: studentLogins[i].HashedPIN });
    }

    // send user email
    studentLogins.forEach((login) => {
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
