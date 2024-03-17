import { CreateError } from '../utils';
import { NextFunction, Request, Response } from 'express';

import { JwtPayload } from 'jsonwebtoken';
import AppConstants from '../constants/app.constant';
import { VerifyToken } from '../utils/auth';
const VerifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return next(CreateError(403, "Access denied"));
        }
        const token = authorization.split(" ")[1];
        if (!token) {
            return next(CreateError(403, "Access denied"));
        }
        const decoded: JwtPayload | string = await VerifyToken(token, "access") as JwtPayload;

        if (!decoded) {
            return next(CreateError(403, "Access denied"));
        }

        // check expiration
        if (decoded.exp && decoded.exp < Date.now().valueOf() / 1000) {
            return next(CreateError(403, "Access token has expired, please login again"));
        }

        // append token to decoded object and set the new object to req.user
        // decoded.token = token;
        req.user = {
            ...decoded, token
        };
        next();
    } catch (error: any) {
        next(error);
    }
}
const VerifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return next(CreateError(403, "Access denied"));
        }
        const token = authorization.split(" ")[1];
        if (!token) {
            return next(CreateError(403, "Access denied"));
        }
        const decoded: JwtPayload | string = await VerifyToken(token, "refresh") as JwtPayload;

        if (!decoded) {
            return next(CreateError(403, "Access denied"));
        }

        // check expiration
        if (decoded.exp && decoded.exp < Date.now().valueOf() / 1000) {
            return next(CreateError(403, "Access token has expired, please login again"));
        }

        // assign user to request object
        req.user = decoded;
        next();
    } catch (error: any) {
        next(error);
    }
}



const VerifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    try {
        if (user.role !== AppConstants.MODULES.SUDO) {
            return next(CreateError(403, "Forbidden Access, Only Admins"));
        }
        next();
    } catch (error: any) {
        next(error);
    }
}
const VerifyIT = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    try {
        if (user.role !== AppConstants.MODULES.IT) {
            return next(CreateError(403, "Forbidden Access, Only IT Staff"));
        }
        next();
    } catch (error: any) {
        next(error);
    }
}
const VerifyDoctor = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    try {
        if (user.role !== AppConstants.MODULES.DOCTOR) {
            return next(CreateError(403, "Forbidden Access, Only Doctors"));
        }
        next();
    } catch (error: any) {
        next(error);
    }
}
const VerifyPatient = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    try {
        if (Object.keys(AppConstants.MODULES).includes(user.role)) {
            return next(CreateError(403, "Forbidden Access, Only patient"));
        }
        next();
    } catch (error: any) {
        next(error);
    }
}
const VerifyNurse = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    try {
        if (user.role !== AppConstants.MODULES.DOCTOR) {
            return next(CreateError(403, "Forbidden Access, Only nurses"));
        }
        next();
    } catch (error: any) {
        next(error);
    }
}

export default {
    ACCESS_TOKEN: VerifyAccessToken,
    REFRESH_TOKEN: VerifyRefreshToken,
    ADMIN: VerifyAdmin,
    DOCTOR: VerifyDoctor,
    SUDO: VerifyAdmin,
    NURSE: VerifyNurse,
    PATIENT: VerifyPatient,
    IT: VerifyIT

}