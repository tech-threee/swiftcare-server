import mongoose from "mongoose";
import AppConstants from "../constants/app.constant";

export interface IBooking {
    date: string;
    patient: mongoose.Types.ObjectId;
    issue: keyof typeof AppConstants.SPECIALITIES;
    status: keyof typeof AppConstants.BOOKING_STATUSES;
    doctor: mongoose.Types.ObjectId;
}

export interface BookingSchema extends IBooking, mongoose.Document {
    _id: mongoose.Types.ObjectId;
    createdAt: string;
    updatedAt: string;
}
