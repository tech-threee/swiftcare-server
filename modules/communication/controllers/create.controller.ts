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
export default async function CreateAllStaffBroadcast(
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
    } = {
      ...loginRow._doc
    }


    // compose the sender: { participantId, userType, email }
    const sender = {
      participantId: CastToId(user!._id.toString()),
      role: authUser.role,
      email: user!.email,
    };

    // get the request payload
    const payload = req.body as CreateCommunicationRequestPayload;


    const staff = await StaffSchema.fetchAllWithoutpagination()
    // create a communication row
    const communication = await CommunicationSchema.create({
      sender,
      recipients: staff.map(
        (staff) => ({
          email: staff.email,
          participantId: CastToId(staff._id.toString()),
          role: staff.role,
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
      name: `${user!.name}`,
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
export async function CreateIndividualCommunique(
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
    } = {
      ...loginRow._doc
    }


    // compose the sender: { participantId, userType, email }
    const sender = {
      participantId: CastToId(user!._id.toString()),
      role: authUser.role,
      email: user!.email,
    };

    // get the request payload
    const payload = req.body as CreateCommunicationRequestPayload;


    const staff = await StaffSchema.fetchAllWithoutpagination()
    // create a communication row
    const communication = await CommunicationSchema.create({
      sender,
      recipients: [{
        participantId: payload.recipients[0].participantId,
        email: payload.recipients[0].email,
        role: payload.recipients[0].role
      }],
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
      name: `${user!.name}`,
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
export async function CreateAllPatientsCommunique(
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
    } = {
      ...loginRow._doc
    }


    // compose the sender: { participantId, userType, email }
    const sender = {
      participantId: CastToId(user!._id.toString()),
      role: authUser.role,
      email: user!.email,
    };

    // get the request payload
    const payload = req.body as CreateCommunicationRequestPayload;


    const patients = await PatientSchema.fetchAllWithoutpagination()
    // create a communication row
    const communication = await CommunicationSchema.create({
      sender,
      recipients: patients.map(
        (patient) => ({
          email: patient.email,
          participantId: CastToId(patient._id.toString()),
          role: patient.role,
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
      name: `${user!.name}`,
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
export async function CreateStaffCommunique(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // get the sender's detail from the jwt (the middleware will
    // add it to req as req.user)
    const authUser: { id: string; role: string; _id: mongoose.Types.ObjectId } = req.user;

    const role = req.query.role as string

    // get the login row for this user and use this to fetch the appropriate
    let loginRow;
    if (!Object.keys(AppConstants.MODULES).includes(authUser.role)) {
      // console.log("isPatient")
      loginRow = await AuthSchema.fetchByPatientId(authUser._id);
    } else {
      // console.log("isStaff")
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
    } = {
      ...loginRow._doc
    }

    console.log({ user })


    // compose the sender: { participantId, userType, email }
    const sender = {
      participantId: user!._id,
      role: authUser.role,
      email: user!.email,
    };

    // get the request payload
    const payload = req.body as CreateCommunicationRequestPayload;


    const staff = await StaffSchema.fetchByRoleWithoutpagination(role ? role : null)
    // create a communication row
    const communication = await CommunicationSchema.create({
      sender,
      recipients: staff.map(
        (staff) => ({
          email: staff.email,
          participantId: CastToId(staff._id.toString()),
          role: staff.role,
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
      name: `${user!.name}`,
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
