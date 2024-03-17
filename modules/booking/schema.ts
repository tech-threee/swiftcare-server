import mongoose from "mongoose";
import { BOOKING } from "../../models";
import { Pagination } from "../../interfaces";
import AppConstants from "../../constants/app.constant";
import { CastToId } from "../../utils/functions";

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


            return null
        } catch (error) {
            throw error
        }
    }


}