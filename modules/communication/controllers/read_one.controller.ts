import { NextFunction, Request, Response } from 'express';

import ResponseHandler from '../../../handlers/response.handler';
import { CastToId, IsValidId } from '../../../utils/functions';
import CommunicationSchema from '../schema';

// This controller is used to read one communication of a participant
// in full: including the replies
export default async function ReadOneCommunication(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const communicationId = req.params.communicationId;
    if (!IsValidId(communicationId)) {
      return new ResponseHandler(res).failure('Invalid communication ID');
    }

    const id = CastToId(communicationId);

    // read the communication by id
    const communication = await CommunicationSchema.fetchOneById(id);
    if (!communication) {
      return new ResponseHandler(res).failure('Communication with not found');
    }

    return new ResponseHandler(res).successWithData(communication);
  } catch (error) {
    return next(error);
  }
}
