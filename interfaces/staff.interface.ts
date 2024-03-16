import { EmergencyContact } from '.';
import mongoose from 'mongoose';
import { MODULES_KEY } from './login.interface';

export interface IStaff {
  name: string;
  email: string;
  dob: string;
  phone: string;
  sid: string;
  role: MODULES_KEY;
  specialty: string;
  emergency_contacts?: EmergencyContact[] | null;
  image: string
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
  pin: string
}

export interface SearchWithPagination extends Pagination {
  query: string;
}
