import mongoose from "mongoose";
import { BOOKING } from "../../models";
import { Pagination } from "../../interfaces";
import AppConstants from "../../constants/app.constant";
import { CastToId } from "../../utils/functions";
import StaffSchema from "../staff/schema";

export default class BookingsSchema {
    static async create(payload: BookingsSchema) {
        try {
            return await BOOKING.create({
                ...payload
            });
        } catch (error) {
            throw error;
        }
    }
    static async changeBookingStatus(id: mongoose.Types.ObjectId, status: keyof typeof AppConstants.BOOKING_STATUSES) {
        try {
            return await BOOKING.findByIdAndUpdate(id, {
                status
            }, { new: true })
        } catch (error) {
            throw error;
        }
    }

    static async countUserBookings(authUser: { id: string; role: string; _id: mongoose.Types.ObjectId }): Promise<number> {
        try {
            let query: any = {};

            // If the role is patient, query bookings where patient is the authUser._id
            if (authUser.role === 'DOCTOR') {
                query.doctor = authUser._id;
            }
            // If the role is doctor, query bookings where doctor is the authUser._id
            else if (authUser.role === 'PATIENT') {
                query.patient = authUser._id;
            }
            // If the role is neither patient nor doctor, return 0
            else {
                return 0;
            }

            // Count the bookings based on the constructed query
            const bookingCount = await BOOKING.countDocuments(query);

            return bookingCount;
        } catch (error) {
            throw error;
        }
    }

    static async rescheduleBooking(id: mongoose.Types.ObjectId, date: string) {
        try {
            return await BOOKING.findByIdAndUpdate(id, {
                date, status: AppConstants.BOOKING_STATUSES.RESCHEDULED
            }).populate("patient").populate("doctor")
        } catch (error) {
            throw error;
        }
    }


    static async fetchOneById(id: mongoose.Types.ObjectId) {
        try {
            const booking = await BOOKING.findById(id).populate("doctor").populate("patient")

            if (!booking) {
                return null;
            }
            return booking;
        } catch (error) {
            throw error;
        }
    }

    static async fetchPaginatedPatientBookings(
        patient: mongoose.Types.ObjectId,
        payload: Pagination,
    ) {
        try {
            const totalBookings = await BOOKING.countDocuments();
            const bookings = await BOOKING.find({
                patient
            })
                .populate("doctor")
                .skip((payload.skip - 1) * payload.limit)
                .limit(payload.limit)
                .sort({ createdAt: 'desc' })
                .exec();

            return {
                totalCount: totalBookings,
                bookings
            }
        } catch (error) {
            throw error;
        }
    }
    static async fetchPaginatedDoctorBookings(
        doctor: mongoose.Types.ObjectId,
        payload: Pagination,
    ) {
        try {
            const totalBookings = await BOOKING.countDocuments();
            const bookings = await BOOKING.find({
                doctor
            })
                .populate("patient")
                .skip((payload.skip - 1) * payload.limit)
                .limit(payload.limit)
                .sort({ createdAt: 'desc' })
                .exec();

            return {
                totalCount: totalBookings,
                bookings
            }
        } catch (error) {
            throw error;
        }
    }
    static async fetchPaginatedBookings(
        payload: Pagination,
    ) {
        try {
            const totalBookings = await BOOKING.countDocuments();
            const bookings = await BOOKING.find({})
                .populate("patient")
                .skip((payload.skip - 1) * payload.limit)
                .limit(payload.limit)
                .sort({ createdAt: 'desc' })
                .exec();

            return {
                totalCount: totalBookings,
                bookings
            }
        } catch (error) {
            throw error;
        }
    }
    static async LookupDoctor(payload: { specialty: string, date: string }): Promise<{ name: string, email: string, _id: mongoose.Types.ObjectId } | null> {
        try {
            // Query for doctors with the given specialty
            const doctors = await StaffSchema.Lookup({ role: "DOCTOR", specialty: payload.specialty })

            // If there are no doctors with the given specialty, return null
            if (!doctors || doctors.length === 0) {
                return null;
            }
            // Iterate over each doctor
            for (const doctor of doctors) {
                // Check if the doctor is booked on the provided date
                const isBooked = await BOOKING.findOne({ doctor: doctor._id.toString(), date: payload.date });

                // If the doctor is not booked, return their information
                if (!isBooked) {
                    const foundDoctor: { name: string, email: string, _id: mongoose.Types.ObjectId } = doctor;
                    return foundDoctor
                }
            }

            return null
        } catch (error) {
            throw error
        }
    }


}