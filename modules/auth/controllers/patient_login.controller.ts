import { NextFunction, Request, Response } from 'express';

import AppConstants from '../../../constants/app.constant';
import ResponseHandler from '../../../handlers/response.handler';
import { LoginAuth, MODULES_KEY } from '../../../interfaces/login.interface';
import StudentSchema from '../../general/student/schema';
import AuthSchema from '../schema';

export default async function StudentLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload: LoginAuth = req.body;

    const isExistingStudentId = await StudentSchema.studentWithPropExists({
      studentID: payload.academicId,
    });
    if (!isExistingStudentId) {
      return new ResponseHandler(res).failure('Student ID not found');
    }

    const isStaffIdHasLoginRow = await AuthSchema.isExistingAcademicId(
      payload.academicId,
    );
    if (!isStaffIdHasLoginRow) {
      return new ResponseHandler(res).failure(
        'Student ID not found, contact support for assistance',
      );
    }

    const responseData = await AuthSchema.authenticate(
      payload,
      AppConstants.MODULES.PATIENT as MODULES_KEY,
    );

    const user = await StudentSchema.getStudentByAcademicId(payload.academicId);

    return new ResponseHandler(res).successWithData({
      ...user._doc,
      ...responseData,
    });
  } catch (error) {
    return next(error);
  }
}
