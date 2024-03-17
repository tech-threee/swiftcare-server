import mongoose from "mongoose"
import { BOOKING, COMMUNICATION, PATIENT, STAFF } from "../../models"
import CommunicationSchema from "../communication/schema"
import BookingsSchema from "../booking/schema";
import AppConstants from "../../constants/app.constant";

export const FETCH_COUNTS = async (authUser: { id: string; role: string; _id: mongoose.Types.ObjectId }): Promise<{ staff: {}; bookings: number; communications: number; patients: number }> => {
    try {
        // Count staff members
        const staffRoles = Object.keys(AppConstants.MODULES);
        const staffCounts: { [key: string]: number } = {};
        for (const role of staffRoles) {
            staffCounts[role] = await STAFF.countDocuments({ role });
        }
        const totalStaff = await STAFF.countDocuments();

        // Count patients
        const patients = await PATIENT.countDocuments();

        // Count communications
        const communications = await CommunicationSchema.countUserCommunications(authUser._id);

        // Count bookings
        const bookings = await BookingsSchema.countUserBookings(authUser);

        return { staff: { Total: totalStaff, ...staffCounts }, patients, communications, bookings };
    } catch (error) {
        throw error;
    }
}