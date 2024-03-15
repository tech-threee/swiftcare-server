import {
  Login,
  LoginAuth,
  LoginRow,
  MODULES_KEY,
  PatientLoginAuth,
  UpdateLoginRow,
} from '../../interfaces/login.interface';
import { BcryptPassword, ComparePassword, GenerateToken } from '../../utils/auth';
import mongoose from 'mongoose';
import { HttpStatus } from '../../handlers/handler.util';
import { LOGIN, PATIENT } from '../../models';
import ApiError from '../../utils/apiError';

export default class AuthSchema {
  private static async getSafe(loginRow: typeof LOGIN) {
    return { ...loginRow, pin: undefined, token: undefined };
  }
  private static async getSafePatient(loginRow: typeof PATIENT) {
    return { ...loginRow, otp: null, token: null }
  }
  static async isExistingSid(sid: string) {
    try {
      const isExistingSid = await LOGIN.findOne({ sid });

      return !!isExistingSid;
    } catch (error) {
      throw error;
    }
  }

  static async add(payload: LoginRow) {
    try {
      await LOGIN.create({ ...payload });
    } catch (error) {
      throw error;
    }
  }
  static async addBulk(payload: LoginRow[]) {
    try {
      await LOGIN.create(payload);
    } catch (error) {
      throw error;
    }
  }

  static async updatePIN(payload: UpdateLoginRow): Promise<void> {
    try {
      await LOGIN.updateOne(
        { sid: payload.sid },
        { $set: { pin: payload.pin } },
      );
    } catch (error) {
      throw error;
    }
  }

  static async authenticate(payload: LoginAuth, type: MODULES_KEY) {
    try {
      // TODO: populate the roles (from modules model)
      const loginRow = await LOGIN.findOne({
        sid: payload.sid,
      }); /* .populate('roles'); */

      if (!loginRow) {
        throw new ApiError(
          `${type} with ID: ${payload.sid} not found`,
          HttpStatus.Success,
        );
      }

      const isAuthenticPin = await ComparePassword(payload.pin, loginRow.pin);
      if (!isAuthenticPin) {
        throw new ApiError(`Invalid pin`, HttpStatus.Success);
      }

      // TODO: abstract the string literal after the module is implemented
      const { accessToken, refreshToken } = GenerateToken({
        sid: loginRow.academicId,
        role: loginRow.role,
      });

      loginRow.lastLogin = new Date();
      loginRow.token = refreshToken;
      await loginRow.save();

      const loginData = AuthSchema.getSafe(loginRow.toObject());

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

      const { PIN, HashedPIN } = await BcryptPassword(6)

      // Update Patient with hashedPin
      await PATIENT.updateOne(
        { email: payload.email },
        { $set: { otp: HashedPIN } }
      );

      return PIN

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
        pid: loginRow.pid,
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

  static async fetchById(id: mongoose.Types.ObjectId) {
    return (await LOGIN.findById(id)) as Login;
  }

  static async fetchBySid(sid: string) {
    return (await LOGIN.findOne({ sid })) as Login;
  }
}
