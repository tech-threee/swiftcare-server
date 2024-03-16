import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';

import {
  getPaginationParams,
  setPaginationParams,
} from '../../../utils/functions';
import PatientSchema from '../schema';

export default async function FetchBulk(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { pageNumber, pageSize } = setPaginationParams(
      req.query.pageNumber?.toString(),
      req.query.pageSize?.toString(),
    );

    const { staff, totalStaff } = await PatientSchema.fetchPaginatedBulk({
      skip: pageNumber,
      limit: pageSize,
    });

    return new ResponseHandler(res).successWithData({
      staff,
      pagination: getPaginationParams(totalStaff, pageNumber, pageSize),
    });
  } catch (error) {
    return next(error);
  }
}
