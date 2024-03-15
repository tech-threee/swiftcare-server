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
import LecturerSchema from '../../general/lecturer/schema';
import StudentSchema from '../../general/student/schema';
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
