import { SentMessageInfo } from 'nodemailer';

import EnvConstants from '../../constants/env.constant';
import { MailerData } from '../../interfaces/mailer.interface';
import transporter from './transport';

const Mailer = async (
  data: MailerData,
  callback: (error: any, info?: SentMessageInfo) => void,
) => {
  const sender = `${EnvConstants.EMAIL_NAME} <${EnvConstants.EMAIL_SENDER}>`;
  // const replyTo = !data.from ? EnvConstants.EMAIL_ID : data.from.email;
  const mailOptions = {
    from: data.from ? `${data.from.name} <${data.from.email}>` : sender,
    to: data.email,
    subject: data.subject,
    text: data.message,
    cc: data.cc,
    bcc: data.bcc,
    // replyTo,
    inReplyTo: `REPLY - ${data.subject}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    callback(null, info);
  } catch (error: any) {
    callback(error);
  }
};

export const SendEmail = async (data: MailerData) => {
  const sender = `${EnvConstants.EMAIL_NAME} <${EnvConstants.EMAIL_SENDER}>`;
  const replyTo = !data.from ? EnvConstants.EMAIL_ID : data.from.email;

  const mailOptions = {
    from: data.from ? `${data.from.name} <${data.from.email}>` : sender,
    to: data.email,
    subject: data.subject,
    // text: data.message,
    html: data.message,
    cc: data.cc,
    bcc: data.bcc,
    // replyTo,
    inReplyTo: `REPLY - ${data.subject}`,
  };

  const res = await transporter.sendMail(mailOptions);

  return res;
};

export default Mailer;
