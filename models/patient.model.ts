import mongoose from 'mongoose';

import { Login } from '../interfaces/login.interface';
import AppConstants from '../constants/app.constant';
import { IPatientSchema } from '../interfaces/patient.interface';
const PatientSchema = new mongoose.Schema<IPatientSchema>(
    {
        pid: {
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
        },
        phone: {
            type: String,
            required: true
        },
        dob: String,
        emergency_contacts: [
            {
                name: String,
                relationship: String,
                email: String,
                phone: String
            }
        ],
        token: String,
    },
    { timestamps: true, versionKey: false },
);

export default mongoose.models['PATIENTS'] ||
    mongoose.model('PATIENTS', PatientSchema);
