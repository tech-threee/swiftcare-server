import {
  Login,
  LoginAuth,
  PatientLoginAuth,
  UpdateLoginRow,
} from '../../interfaces/login.interface';
import {
  BcryptPassword,
  ComparePassword,
  GenerateToken,
} from '../../utils/auth';
import mongoose from 'mongoose';
import { HttpStatus } from '../../handlers/handler.util';
import { STAFF, PATIENT } from '../../models';
import ApiError from '../../utils/apiError';

export default class AuthSchema {
  private static async getSafeStaff(loginRow: typeof STAFF) {
    return { ...loginRow, pin: undefined, token: undefined };
  }
  private static async getSafePatient(loginRow: typeof PATIENT) {
    return { ...loginRow, otp: null, token: null };
  }
  static async isExistingSid(sid: string) {
    try {
      const isExistingSid = await STAFF.findOne({ sid });

      return !!isExistingSid;
    } catch (error) {
      throw error;
    }
  }

  static async authenticateStaff(payload: LoginAuth) {
    try {
      // TODO: populate the roles (from modules model)
      const loginRow = await STAFF.findOne({
        sid: payload.sid,
      }); /* .populate('roles'); */

      if (!loginRow) {
        throw new ApiError(
          `STAFF with ID: ${payload.sid} not found`,
          HttpStatus.Success,
        );
      }

      const isAuthenticPin = await ComparePassword(payload.pin, loginRow.pin);
      if (!isAuthenticPin) {
        throw new ApiError(`Invalid pin`, HttpStatus.Success);
      }

      // TODO: abstract the string literal after the module is implemented
      const { accessToken, refreshToken } = GenerateToken({
        id: loginRow.sid,
        role: loginRow.role,
        _id: loginRow._id,
      });

      // loginRow.lastLogin = new Date();
      loginRow.token = refreshToken;
      await loginRow.save();

      const loginData = AuthSchema.getSafeStaff(loginRow.toObject());

      return { login: loginData, token: accessToken };
    } catch (error) {
      throw error;
    }
  }

  static async PatientRequestOtp(payload: PatientLoginAuth) {
    try {
      // TODO: populate the roles (from modules model
      const loginRow = await PATIENT.findOne({
        email: payload.email,
      }); /* .populate('roles'); */

      if (!loginRow) {
        throw new ApiError(
          `Patient with email: ${payload.email} not found`,
          HttpStatus.Success,
        );
      }

      const { PIN, HashedPIN } = await BcryptPassword(6);

      // Update Patient with hashedPin
      await PATIENT.updateOne(
        { email: payload.email },
        { $set: { otp: HashedPIN } },
      );

      return PIN;
    } catch (error) {
      throw error;
    }
  }
  static async authenticatePatient(payload: PatientLoginAuth) {
    try {
      // TODO: populate the roles (from modules model)
      const loginRow = await PATIENT.findOne({
        email: payload.email,
      }); /* .populate('roles'); */

      if (!loginRow) {
        throw new ApiError(
          `Patient with email: ${payload.email} not found`,
          HttpStatus.Success,
        );
      }

      const isAuthenticPin = await ComparePassword(payload.otp, loginRow.otp);
      if (!isAuthenticPin) {
        throw new ApiError(`Invalid pin`, HttpStatus.Success);
      }

      // TODO: abstract the string literal after the module is implemented
      const { accessToken, refreshToken } = GenerateToken({
        id: loginRow.pid,
        _id: loginRow._id,
      });

      loginRow.lastLogin = new Date();
      loginRow.token = refreshToken;
      await loginRow.save();

      const loginData = await AuthSchema.getSafePatient(loginRow.toObject());

      return { login: loginData, token: accessToken };
    } catch (error) {
      throw error;
    }
  }

  static async fetchByStaffId(id: mongoose.Types.ObjectId) {
    return (await STAFF.findById(id)) as Login;
  }

  static async fetchByStaffSid(sid: string) {
    return (await STAFF.findOne({ sid })) as Login;
  }
  static async fetchByPatientId(id: mongoose.Types.ObjectId) {
    return (await PATIENT.findById(id)) as Login;
  }

  static async fetchByPatientPid(sid: string) {
    return (await PATIENT.findOne({ sid })) as Login;
  }
}
