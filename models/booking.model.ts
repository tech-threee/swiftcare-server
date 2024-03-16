import mongoose from 'mongoose';
import AppConstants from '../constants/app.constant';
import { BookingSchema } from '../interfaces/booking.interface';

const BookingsSchema = new mongoose.Schema<BookingSchema>(
    {
        patient: mongoose.Types.ObjectId,
        date: {
            type: String,
            required: true
        },
        issue: {
            type: String,
            enum: Object.keys(AppConstants.SPECIALITIES)
        },
        status: {
            type: String,
            enum: Object.keys(AppConstants.BOOKING_STATUSES)
        },
        doctor: mongoose.Types.ObjectId

    },
    { timestamps: true, versionKey: false },
);

export default mongoose.models['BOOKINGS'] ||
    mongoose.model('BOOKINGS', BookingsSchema);
