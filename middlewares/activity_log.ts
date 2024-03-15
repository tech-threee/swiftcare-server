import { NextFunction, Request, Response } from 'express';

import { ACTIVITY_LOG } from '../models';

// TODO: fix this code
export const logActivity = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const logData = {
    action: req.method + ' ' + req.path,
    details: JSON.stringify(req.body), // Adjust as needed based on your payload
  };

  const activityLog = new ACTIVITY_LOG(logData);
  activityLog
    .save()
    .then(() => next())
    .catch((error: any) => next(error));
};
