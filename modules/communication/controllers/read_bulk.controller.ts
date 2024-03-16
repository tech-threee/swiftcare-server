import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import AppConstants from '../../../constants/app.constant';
import { HttpStatus } from '../../../handlers/handler.util';
import ResponseHandler from '../../../handlers/response.handler';
import ApiError from '../../../utils/apiError';
import {
  DecodeBase64,
  getPaginationParams,
  setPaginationParams,
} from '../../../utils/functions';

import AuthSchema from '../../auth/schema';
import StaffSchema from '../../staff/schema';
import patientSchema from '../../patient/schema';
import CommunicationSchema from '../schema';

// This controller is used to read all (list) communication by a participant
export default async function ReadBulkCommunications(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // get the sender's detail from the jwt (the middleware will
    // add it to req as req.user)
    const authUser: { id: string; role: string; _id: mongoose.Types.ObjectId } = req.user;

    // get the login row for this user and use this to fetch the appropriate
    // user data base on the type
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

    const { pageNumber, pageSize } = setPaginationParams(
      req.query.pageNumber?.toString(),
      req.query.pageSize?.toString(),
    );

    const { communications, totalCommunication } =
      await CommunicationSchema.fetchPaginatedBulk(user!._id, {
        skip: pageNumber,
        limit: pageSize,
      });

    return new ResponseHandler(res).successWithData({
      communications,
      pagination: getPaginationParams(totalCommunication, pageNumber, pageSize),
    });
  } catch (error) {
    return next(error);
  }
}
