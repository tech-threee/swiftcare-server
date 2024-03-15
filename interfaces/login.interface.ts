import mongoose from 'mongoose';
import AppConstants from '../constants/app.constant';

export interface Login {
  academicId: string;
  pin: string;
  roles: mongoose.Types.ObjectId[];
  lastLogin: Date;
  lastSignOut: Date;
  token: string;
}

export interface LoginRow {
  academicId: string;
  roles: mongoose.Types.ObjectId[];
  pin: string;
}

export interface UpdateLoginRow {
  academicId: string;
  pin: string;
}

export interface LoginAuth {
  academicId: string;
  pin: string;
}

// export type UserTypes = 'student' | 'lecturer' | 'staff'

export interface UserTokenPayload {
  academicId: string;
  roles: mongoose.Types.ObjectId[];
  type: MODULES_KEY;
}

export type MODULES_KEY = keyof typeof AppConstants.MODULES;
