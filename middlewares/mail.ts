import { NextFunction, Request, Response } from 'express';

import Mailer from '../services/mail';

export const Mail = async (req: Request, res: Response, next: NextFunction) => {
  const { email, subject, message, cc, bcc, from } = req.body;
  const data = {
    email,
    subject,
    message,
    cc,
    bcc,
    from,
  };
  try {
    await Mailer(data, (err, nfo) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({
          message: 'Email sent successfully',
          data: nfo,
        });
      }
    });
  } catch (error) {
    next(error);
  }
};
