import mongoose, { FilterQuery } from 'mongoose';

import {
  IPaginationParam,
  IPatientUpdateParam,
  IPatient,
  IPatientSchema,
  IPatientFilter,
} from '../../../interfaces/patient.interface';
import { PATIENT } from '../../../models';
import ApiError from '../../../utils/apiError';

export default class PatientSchema {
  // Add Student
  static async addSingle(patient: IPatient): Promise<IPatientSchema> {
    try {
      return await PATIENT.create(patient);
    } catch (error) {
      console.log(">>>>>>>>>>>>", error)
      throw new ApiError("Add patient failed")
    }
  }

  static async addBulk(patients: IPatient[]): Promise<IPatientSchema[]> {
    return await PATIENT.create(patients);
  }

  // Update student
  static async updateStudentByID(
    id: mongoose.Types.ObjectId,
    update: IPatientUpdateParam,
  ) {
    return await PATIENT.findByIdAndUpdate({ _id: id }, update, {
      new: true,
    });
  }

  // Delete ~ single
  static async deleteSingle(id: mongoose.Types.ObjectId) {
    const patient = await PATIENT.findById(id);

    if (!patient) {
      throw new ApiError('patient not found');
    }

    await PATIENT.deleteOne({ _id: id });
  }

  // Delete ~ bulk
  static async deleteBulk(patientFilters: mongoose.Types.ObjectId[]) {
    await PATIENT.deleteMany({ _id: { $in: patientFilters } });
  }

  // Fetch ~ All -- with pagination
  static async getAllPatients(pageParam: IPaginationParam) {
    const totalPatients = await PATIENT.countDocuments({});
    const patients = (await PATIENT.find({})
      .skip((pageParam.skip - 1) * pageParam.limit)
      .limit(pageParam.limit)
      .sort({ createdAt: 'desc' })
      .exec()) as IPatientSchema[];

    return { patients, totalPatients };
  }

  // Fetch ~ Single
  static async getPatientByID(id: mongoose.Types.ObjectId) {
    return await PATIENT.findById(id);
  }

  /* 
      SEARCH FOR A STUDENT
      The takes in an object of the shape:
      {
          [search_parameter]: [possible_parameter_value]
      }
  */
  static async searchPatient(
    filter: IPatientFilter,
    pageParam: IPaginationParam,
  ): Promise<Record<string, IPatientSchema[] | number>> {
    // object must be non-empty
    if (Object.keys(filter).length < 0) {
      return {};
    }

    const totalResults = await PATIENT.countDocuments(filter);
    const searchResults: IPatientSchema[] = await PATIENT.find(filter)
      .skip((pageParam.skip - 1) * pageParam.limit)
      .limit(pageParam.limit)
      .sort({ createdAt: 'desc' })
      .exec();

    return { searchResults, totalResults };
  }

  static async patientWithPropExists(
    prop: FilterQuery<Partial<IPatient>>,
  ): Promise<boolean> {
    const res = await PATIENT.findOne(prop);

    return !!res;
  }
  static async getPatientWithProp(
    prop: FilterQuery<Partial<IPatient>>,
  ): Promise<any> {
    const res = await PATIENT.findOne(prop);

    return res;
  }

  static async getPatientByPid(pid: string) {
    try {
      // TODO: Populate the student's program and level
      const res = await PATIENT.findOne({ pid });
      /* .populate('program')*/

      return res;
    } catch (error) {
      throw error;
    }
  }
}
