import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import AppConstants from '../../../constants/app.constant';
import { HttpStatus } from '../../../handlers/handler.util';
import ResponseHandler from '../../../handlers/response.handler';
import ApiError from '../../../utils/apiError';
import {
  CastToId,
  GetTopicFromText,
  IsValidId,
} from '../../../utils/functions';

import { SendEmail } from '../../../services/mail';
import newReplyTemplates from '../../../services/mail/templates/new_reply.template';
import AuthSchema from '../../auth/schema';
// import StaffSchema from '../../staff/schema';
// import PatientSchema from '../../patient/schema';
import CommunicationSchema from '../schema';

// This controller is used to add reply a communication
export default async function ReplyCommunication(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // determine this user from the req.user
    // get the sender's detail from the jwt (the middleware will
    // add it to req as req.user)
    const authUser: { id: string; role: string; _id: mongoose.Types.ObjectId } = req.user;

    // get the login row for this user and use this to fetch the appropriate
    // user data base on the type
    let loginRow;
    if (!Object.keys(AppConstants).includes(authUser.role)) {
      loginRow = await AuthSchema.fetchByPatientId(authUser._id);
    } else {
      loginRow = await AuthSchema.fetchByStaffId(authUser._id);
    }
    if (!loginRow) {
      return new ResponseHandler(res).error(
        new ApiError('Action forbidden', HttpStatus.Forbidden),
      );
    }

    // get the sender's email by reading the sender's detail from appropriate model
    const user: {
      _id: mongoose.Types.ObjectId;
      email: string;
      name: string
    } | null = {
      ...loginRow
    }

    // this is the person who is replying to the message
    const sender = {
      participantId: CastToId(user!._id.toString()),
      role: authUser.role,
      email: user!.email,
    };

    // when replying, this user needs to reply to an existing communication
    const communicationId = req.params.communicationId;
    if (!IsValidId(communicationId)) {
      return new ResponseHandler(res).failure(
        'Invalid communication ID provided',
      );
    }

    const id = CastToId(communicationId);

    const communication = await CommunicationSchema.fetchOneById(id);
    if (!communication) {
      return new ResponseHandler(res).failure('Communication not found');
    }

    // this user but either be the sender or a recipient
    const stringifiedUserId = sender.participantId.toString();

    const isUserSender =
      communication.sender.participantId.toString() === stringifiedUserId;

    const isUserRecipient = communication.recipients.some(
      (recipient: { participantId: { toString: () => any } }) =>
        recipient.participantId.toString() === stringifiedUserId,
    );

    // If the user is neither the sender nor a recipient, deny access
    if (!isUserSender && !isUserRecipient) {
      return new ResponseHandler(res).error(
        new ApiError('Action forbidden', HttpStatus.Forbidden),
      );
    }

    // get the reply text
    const text = req.body.text as string;

    // encode text before adding reply
    await CommunicationSchema.reply(id, { sender, text });

    // send the others an email notifying that this user has replied to the communication
    // TODO: get the url for the communication and pass it down

    const topic = GetTopicFromText(communication.text);
    const senderName = `${user!.name}`;

    const messageTemplate = newReplyTemplates({
      link: 'some-url-that-will-open-this-communication',
      name: senderName,
      topic,
    });

    const recipients = [
      communication.sender.email,
      ...communication.recipients.map(
        (recipient: { email: string }) => recipient.email,
      ),
    ].filter((email) => email !== sender.email);

    SendEmail({
      email: sender.email,
      bcc: recipients,
      subject: `${senderName} replied to ${topic}`,
      message: messageTemplate,
    });

    return new ResponseHandler(res).success('Reply sent successfully');
  } catch (error) {
    return next(error);
  }
}
