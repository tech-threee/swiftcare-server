import { EmergencyContact } from '.';
import mongoose from 'mongoose';
import { MODULES_KEY } from './login.interface';
import AppConstants from '../constants/app.constant';

export interface IStaff {
  name: string;
  email: string;
  dob: string;
  phone: string;
  sid: string;
  role: MODULES_KEY;
  specialty: keyof typeof AppConstants.SPECIALITIES;
  emergency_contacts?: EmergencyContact[] | null;
  image: string;
  pin: string;
}

export interface FindStaffWhere {
  field: keyof IStaff;
  value: string;
}

export interface Pagination {
  limit: number;
  skip: number;
}

export interface IStaffSchema extends IStaff, mongoose.Document {
  _id: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
  token: string;
}

export interface SearchWithPagination extends Pagination {
  query: string;
}
