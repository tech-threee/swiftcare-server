import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import AppConstants from '../constants/app.constant';
import { HttpStatus } from '../handlers/handler.util';
import ResponseHandler from '../handlers/response.handler';
import { MODULES_KEY } from '../interfaces/login.interface';
import ApiError from '../utils/apiError';
import { VerifyToken } from '../utils/auth';

const VerifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  try {
    if (user.role !== 'admin') {
      return new ResponseHandler(res).error(
        new ApiError('Forbidden Access', HttpStatus.Forbidden),
      );
    }

    next();
  } catch (error: any) {
    next(error);
  }
};

export const IS_LOGGEDIN = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return new ResponseHandler(res).error(
        new ApiError('Access Denied', HttpStatus.AccessDenied),
      );
    }

    const token = authorization.split(' ')[1];
    console.log("..", token)
    if (!token) {
      return new ResponseHandler(res).error(
        new ApiError('Access Denied', HttpStatus.AccessDenied),
      );
    }

    const decoded: JwtPayload | string = (await VerifyToken(
      token,
      'access',
    )) as JwtPayload;

    if (!decoded) {
      return new ResponseHandler(res).error(
        new ApiError('Access Denied', HttpStatus.AccessDenied),
      );
    }

    // check expiration
    if (decoded.exp && decoded.exp < Date.now().valueOf() / 1000) {
      return new ResponseHandler(res).error(
        new ApiError(
          'Access token has expired, please login again',
          HttpStatus.AccessDenied,
        ),
      );
    }

    // append token to decoded object and set the new object to req.user
    decoded.token = token;
    console.log({ decoded })
    req.user = decoded;
    next();
  } catch (error: any) {
    next(error);
  }
};

export const IS_PATIENT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    if (!user.role)
      return new ResponseHandler(res).error(
        new ApiError('Forbidden Access', HttpStatus.Forbidden),
      );

    // for the array of roles which is an array of mogoose object ids which references the module collection,
    // check if any of the module slug is patient
    const isPatient = user!.role === AppConstants.ROLES.PATIENT;
    if (!isPatient) {
      return new ResponseHandler(res).error(
        new ApiError('Forbidden Access', HttpStatus.Forbidden),
      );
    }
    next();
  } catch (error: any) {
    next(error);
  }
};
export const IS_STAFF = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    if (!user.roles)
      return new ResponseHandler(res).error(
        new ApiError('Forbidden Access', HttpStatus.Forbidden),
      );

    const isPatient = user!.role === AppConstants.ROLES.PATIENT;

    if (isPatient) {
      return new ResponseHandler(res).error(
        new ApiError('Forbidden Access', HttpStatus.Forbidden),
      );
    }
    next();
  } catch (error: any) {
    next(error);
  }
};

export const IS_SUDO = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    if (!user.roles)
      return new ResponseHandler(res).error(
        new ApiError('Forbidden Access', HttpStatus.Forbidden),
      );

    const isLecturer = user.role === AppConstants.MODULES.SUDO;

    if (!isLecturer) {
      return new ResponseHandler(res).error(
        new ApiError('Forbidden Access', HttpStatus.Forbidden),
      );
    }
    next();
  } catch (error: any) {
    next(error);
  }
};

export const IS_DOCTOR = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    if (!user.roles)
      return new ResponseHandler(res).error(
        new ApiError('Forbidden Access', HttpStatus.Forbidden),
      );

    const isDoctor = user.role === AppConstants.MODULES.DOCTOR;

    if (!isDoctor) {
      return new ResponseHandler(res).error(
        new ApiError('Forbidden Access', HttpStatus.Forbidden),
      );
    }
    next();
  } catch (error: any) {
    next(error);
  }
};

export const IS_NURSE = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    if (!user.roles)
      return new ResponseHandler(res).error(
        new ApiError('Forbidden Access', HttpStatus.Forbidden),
      );

    const isNurse = user!.role === AppConstants.MODULES.NURSE;

    if (!isNurse) {
      return new ResponseHandler(res).error(
        new ApiError('Forbidden Access', HttpStatus.Forbidden),
      );
    }

    next();
  } catch (error: any) {
    next(error);
  }
};

const VerifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      // forbidden access
      return new ResponseHandler(res).error(
        new ApiError('Forbidden Access', HttpStatus.Forbidden),
      );
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      return new ResponseHandler(res).error(
        new ApiError('Access Denied', HttpStatus.AccessDenied),
      );
    }

    const decoded: JwtPayload | string = (await VerifyToken(
      token,
      'refresh',
    )) as JwtPayload;

    if (!decoded) {
      return new ResponseHandler(res).error(
        new ApiError('Access Denied', HttpStatus.AccessDenied),
      );
    }

    // check expiration
    if (decoded.exp && decoded.exp < Date.now().valueOf() / 1000) {
      return new ResponseHandler(res).error(
        new ApiError(
          'Access token has expired, please login again',
          HttpStatus.AccessDenied,
        ),
      );
    }

    // assign user to request object
    req.user = decoded;
    next();
  } catch (error: any) {
    next(error);
  }
};
