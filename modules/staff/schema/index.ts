import mongoose from 'mongoose';

import { HttpStatus } from '../../../handlers/handler.util';
import {
  FindStaffWhere,
  IStaff,
  Pagination,
  SearchWithPagination,
} from '../../../interfaces/staff.interface';
import { STAFF } from '../../../models';
import ApiError from '../../../utils/apiError';

export default class StaffSchema {
  private static async isExistingField(
    payload: FindStaffWhere,
  ): Promise<boolean> {
    try {
      const lecturer = await STAFF.findOne({
        [payload.field]: payload.value,
      });

      return !!lecturer;
    } catch (error) {
      throw error;
    }
  }

  static async addSingle(payload: IStaff) {
    try {
      await STAFF.create({ ...payload });
    } catch (error) {
      throw error;
    }
  }

  static async fetchSingleById(id: mongoose.Types.ObjectId) {
    try {
      return await STAFF.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async fetchBySid(payload: string) {
    try {
      return await STAFF.findOne({
        sid: payload,
      });
    } catch (error) {
      throw error;
    }
  }

  static async fetchPaginatedBulk(payload: Pagination) {
    try {
      const totalStaff = await STAFF.countDocuments();
      const staff = await STAFF.find()
        .skip((payload.skip - 1) * payload.limit)
        .limit(payload.limit)
        .sort({ createdAt: 'desc' })

        .exec();

      return {
        staff,
        totalStaff,
      };
    } catch (error) {
      throw error;
    }
  }

  static async searchPaginated(payload: SearchWithPagination) {
    try {
      const caseInsensitiveRegex = new RegExp(`${payload.query}`, 'i');

      const filter = {
        $or: [
          { dob: { $regex: caseInsensitiveRegex } },
          { name: { $regex: caseInsensitiveRegex } },
          { specialty: { $regex: caseInsensitiveRegex } },
          { role: { $regex: caseInsensitiveRegex } },
          { email: { $regex: caseInsensitiveRegex } },
          { phone: { $regex: caseInsensitiveRegex } },
          { pid: { $regex: caseInsensitiveRegex } },
        ],
      };

      const totalStaff = await STAFF.countDocuments(filter);
      const staff = await STAFF.find(filter)
        .skip((payload.skip - 1) * payload.limit)
        .limit(payload.limit)
        .sort({ createdAt: 'desc' })

        .exec();

      return {
        staff,
        totalStaff,
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateById(id: mongoose.Types.ObjectId, payload: IStaff) {
    try {
      let staff = await STAFF.findById(id);

      if (!staff) {
        throw new ApiError('staff not found', HttpStatus.Success);
      }

      if (payload.image) {
        staff.image = payload.image;
      }

      // lecturer.title = payload.title;
      // lecturer.surname = payload.surname;
      // lecturer.otherNames = payload.otherNames;
      // lecturer.staffID = payload.staffID;
      // lecturer.email = payload.email;
      // lecturer.phone = payload.phone;
      // lecturer.projectArea = payload.projectArea;
      // lecturer.officeHours = payload.officeHours;
      // lecturer.officeLocation = payload.officeLocation;

      staff = {
        ...staff,
        ...payload,
      };

      await staff.save();
    } catch (error) {
      throw error;
    }
  }

  static async deleteSingle(id: mongoose.Types.ObjectId) {
    try {
      const staff = await STAFF.findById(id);

      if (!staff) {
        throw new ApiError('staff not found', HttpStatus.Success);
      }

      await staff.deleteOne();
    } catch (error) {
      throw error;
    }
  }

  static async deleteBulk(ids: mongoose.Types.ObjectId[]) {
    try {
      await STAFF.deleteMany({ _id: { $in: ids } });
    } catch (error) {
      throw error;
    }
  }

  static async isExistingStaffID(staffID: string) {
    try {
      return StaffSchema.isExistingField({
        field: 'sid',
        value: staffID,
      });
    } catch (error) {
      throw error;
    }
  }

  static async isExistingEmail(email: string) {
    try {
      return StaffSchema.isExistingField({
        field: 'email',
        value: email,
      });
    } catch (error) {
      throw error;
    }
  }

  static async isExistingPhone(phone: string) {
    try {
      return StaffSchema.isExistingField({
        field: 'phone',
        value: phone,
      });
    } catch (error) {
      throw error;
    }
  }
}
