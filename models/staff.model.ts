import mongoose from 'mongoose';
import { IStaffSchema } from '../interfaces/staff.interface';
import AppConstants from '../constants/app.constant';
const StaffSchema = new mongoose.Schema<IStaffSchema>(
  {
    sid: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Provide staff login pin'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    dob: String,
    emergency_contacts: [
      {
        name: String,
        relationship: String,
        email: String,
        phone: String,
      },
    ],
    token: String,
    specialty: String,
    role: {
      enum: Object.keys(AppConstants.MODULES),
    },
    pin: String,
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.models['STAFF'] ||
  mongoose.model('STAFF', StaffSchema);
