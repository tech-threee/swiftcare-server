import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';

import {
  getPaginationParams,
  setPaginationParams,
} from '../../../utils/functions';
import StaffSchema from '../schema';
import PatientSchema from '../../patient/schema';

export default async function FetchBulkStaff(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { pageNumber, pageSize } = setPaginationParams(
      req.query.pageNumber?.toString(),
      req.query.pageSize?.toString(),
    );

    const { patients, totalPatients } = await PatientSchema.fetchPaginatedBulk({
      skip: pageNumber,
      limit: pageSize,
    });

    return new ResponseHandler(res).successWithData({
      patients,
      pagination: getPaginationParams(totalPatients, pageNumber, pageSize),
    });
  } catch (error) {
    return next(error);
  }
}
