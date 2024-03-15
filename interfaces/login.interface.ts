import mongoose from 'mongoose';
import AppConstants from '../constants/app.constant';

export interface Login {
  sid: string;
  pin: string;
  role: keyof typeof AppConstants.MODULES;
  lastLogin: Date;
  lastSignOut: Date;
  token: string;
}

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
  otp: string
}

// export type UserTypes = 'student' | 'lecturer' | 'staff'

export interface UserTokenPayload {
  sid?: string;
  role?: MODULES_KEY;
  pid?: string
}

export interface PatientTokenPayload {
  pid: string
}

export type MODULES_KEY = keyof typeof AppConstants.MODULES;
