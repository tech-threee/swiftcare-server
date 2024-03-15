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
import LecturerSchema from '../../general/lecturer/schema';
import StudentSchema from '../../general/student/schema';
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
    const authUser: { academicId: string; type: string } = req.user;

    // get the login row for this user and use this to fetch the appropriate
    // user data base on the type
    const loginRow = await AuthSchema.fetchByAcademicId(authUser.academicId);
    if (!loginRow) {
      return new ResponseHandler(res).error(
        new ApiError('Action forbidden', HttpStatus.Forbidden),
      );
    }

    // get the sender's email by reading the sender's detail from appropriate model
    let user: {
      _id: mongoose.Types.ObjectId;
      email: string;
      surname: string;
      otherNames: string;
    } | null = null;
    if (authUser.type.toLowerCase() === AppConstants.ROLES.STAFF) {
      user = await LecturerSchema.fetchByAcademicId(loginRow.academicId);
    } else if (authUser.type.toLowerCase() === AppConstants.ROLES.PATIENT) {
      user = await StudentSchema.getStudentByAcademicId(loginRow.academicId);
    } else {
      return new ResponseHandler(res).error(
        new ApiError('Action forbidden', HttpStatus.Forbidden),
      );
    }

    // compose the sender: { participantId, userType, email }
    const sender = {
      participantId: CastToId(user!._id.toString()),
      userType: authUser.type,
      email: user!.email,
    };

    // get the request payload
    const payload = req.body as CreateCommunicationRequestPayload;

    // create a communication row
    const communication = await CommunicationSchema.create({
      sender,
      recipients: payload.recipients.map(
        ({ email, participantId, userType }) => ({
          email,
          participantId: CastToId(participantId.toString()),
          userType,
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
      name: `${user?.surname} ${user?.otherNames}`,
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
