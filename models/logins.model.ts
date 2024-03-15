import mongoose from 'mongoose';

import { Login } from '../interfaces/login.interface';
import AppConstants from '../constants/app.constant';
const LoginSchema = new mongoose.Schema<Login>(
    {
        sid: {
            type: String,
            unique: true,
        },
        pin: {
            type: String,
            required: [true, "Provide staff login pin"]
        },
        role: {
            type: String,
            enum: Object.values(AppConstants.MODULES),
            required: true
        },
        lastLogin: Date,
        lastSignOut: Date,
        token: String,
    },
    { timestamps: true, versionKey: false },
);

export default mongoose.models['LOGINS'] || mongoose.model('LOGINS', LoginSchema);
