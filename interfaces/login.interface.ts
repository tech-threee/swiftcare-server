import mongoose, { Mongoose } from 'mongoose';
import AppConstants from '../constants/app.constant';



export interface LoginRow {
  sid: string;
  role: string;
  pin: string;
}

export interface UpdateLoginRow {
  sid: string;
  pin: string;
}

export interface LoginAuth {
  sid: string;
  pin: string;
}

export interface PatientLoginAuth {
  email: string;
  otp: string;
}

// export type UserTypes = 'student' | 'lecturer' | 'staff'

export interface UserTokenPayload {
  id: string;
  _id: mongoose.Types.ObjectId;
  role?: MODULES_KEY;
}

export type MODULES_KEY = keyof typeof AppConstants.MODULES;
