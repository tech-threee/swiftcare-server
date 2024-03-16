import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import AppConstants from '../../../constants/app.constant';
import { HttpStatus } from '../../../handlers/handler.util';
import ResponseHandler from '../../../handlers/response.handler';
import { CreateCommunicationRequestPayload } from '../../../interfaces/communication.interface';
import { SendEmail } from '../../../services/mail';
import newCommunicationEmailTemplate from '../../../services/mail/templates/new_communication';
import ApiError from '../../../utils/apiError';
import { CastToId, GetTopicFromText } from '../../../utils/functions';

import AuthSchema from '../../auth/schema';
import StaffSchema from '../../staff/schema';
import PatientSchema from '../../patient/schema';
import CommunicationSchema from '../schema';

// This controller is used to initiate a communication
export default async function CreateCommunication(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // get the sender's detail from the jwt (the middleware will
    // add it to req as req.user)
    const authUser: { id: string; role: string; _id: mongoose.Types.ObjectId } = req.user;

    // get the login row for this user and use this to fetch the appropriate
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


    // compose the sender: { participantId, userType, email }
    const sender = {
      participantId: CastToId(user!._id.toString()),
      role: authUser.role,
      email: user!.email,
    };

    // get the request payload
    const payload = req.body as CreateCommunicationRequestPayload;

    // create a communication row
    const communication = await CommunicationSchema.create({
      sender,
      recipients: payload.recipients.map(
        ({ email, participantId, role }) => ({
          email,
          participantId: CastToId(participantId.toString()),
          role,
        }),
      ),
      text: payload.text,
    });
    if (!communication) {
      return new ResponseHandler(res).failure(
        'Could not initiate communication, please try again',
      );
    }

    // send that the communication is created successfully
    new ResponseHandler(res).success('Communication initiated successfully');

    // TODO: get the url for viewing the communication
    // and pass it down. Request for this from the front-end

    // topic is just some part of the message
    const topic = GetTopicFromText(payload.text);

    const messageTemplate = newCommunicationEmailTemplate({
      name: `${user.name}`,
      link: 'some-url-to-view-communication',
      topic,
    });

    // send email notifications to all the recipients involved
    SendEmail({
      email: sender.email,
      bcc: payload.recipients.map((recipient) => recipient.email),
      subject: 'Communication Invitation',
      message: messageTemplate,
    });
  } catch (error) {
    return next(error);
  }
}
