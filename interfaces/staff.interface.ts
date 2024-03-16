import { EmergencyContact } from '.';
import mongoose from 'mongoose';

export interface StaffRecord {
  name: string;
  email: string;
  dob: string;
  phone: string;
  sid: string;
  department: string;
  emergency_contacts?: EmergencyContact[] | null;
}

export interface DoctorInterface extends StaffRecord {
  specialization: string;
}

export interface NurseInterface extends StaffRecord { }

interface ProjectArea {
  projectAreaId: mongoose.Types.ObjectId;
  status: string; // active | inactive;
}

export interface FindStaffWhere {
  field: keyof StaffRecord;
  value: string;
}

export interface Pagination {
  limit: number;
  skip: number;
}

export interface Lecturer {
  image: string;
  title: string;
  surname: string;
  otherNames: string;
  staffID: string;
  email: string;
  phone: string;
  projectArea: ProjectArea[];
  officeHours: string;
  officeLocation: string;
}

export interface SearchWithPagination extends Pagination {
  query: string;
}
