import nodemailer from 'nodemailer';

import EnvConstants from '../../constants/env.constant';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: EnvConstants.EMAIL_ID,
    pass: EnvConstants.EMAIL_PASSWORD,
  },
});

export default transporter;
