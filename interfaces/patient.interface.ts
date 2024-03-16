import { EmergencyContact } from '.';
import mongoose from 'mongoose';
export interface IPatient {
  name: string;
  email: string;
  dob: string;
  phone: string;
  pid?: string;
  emergency_contacts?: EmergencyContact[] | null;
  weight?: string;
  image?:string
}

export interface MedicalRecord {
  rid: string;
  patient: string;
  known_medical_conditions?: string[];
  allergies?: string[];
  physician_informations: PhysicianInformation[];
}

export interface PhysicianInformation {
  doctor: string;
  notes: string;
}

export interface InsuranceInformation { }

export interface IPatientSchema extends IPatient, mongoose.Document {
  _id: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
  token: string;
  otp: string
}

export interface IStudentModel extends mongoose.Model<IPatientSchema> { }

export interface IPatientFilter
  extends mongoose.FilterQuery<
    Partial<Pick<IPatient, 'email' | 'name' | 'phone' | 'pid'>>
  > { }

export interface IPatientUpdateParam
  extends Partial<Pick<IPatient, 'name' | 'email' | 'phone' | 'image'>> { }

export interface IPaginationParam {
  limit: number;
  skip: number;
}
