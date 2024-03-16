import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';
import {
  getPaginationParams,
  setPaginationParams,
} from '../../../utils/functions';
import Patient from '../schema';

export default async function Search(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = req.query.query as string;

    if (!query) {
      return new ResponseHandler(res).failure('Search query required');
    }

    const { pageNumber, pageSize } = setPaginationParams(
      req.query.pageNumber?.toString(),
      req.query.pageSize?.toString(),
    );

    const { staff, totalStaff } = await Patient.searchPaginated({
      skip: pageNumber,
      limit: pageSize,
      query,
    });

    return new ResponseHandler(res).successWithData({
      staff,
      pagination: getPaginationParams(totalStaff, pageNumber, pageSize),
    });
  } catch (error) {
    return next(error);
  }
}
