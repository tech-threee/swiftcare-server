import mongoose from "mongoose"
import { BOOKING, COMMUNICATION, PATIENT, STAFF } from "../../models"
import CommunicationSchema from "../communication/schema"
import BookingsSchema from "../booking/schema";

export const FETCH_COUNTS = async (authUser: { id: string; role: string; _id: mongoose.Types.ObjectId }): Promise<{ staff: number, bookings: number, communications: number, patients: number }> => {
    try {
        const staff = await STAFF.countDocuments()
        const patients = await PATIENT.countDocuments()
        const communications = await CommunicationSchema.countUserCommunications(authUser._id)
        const bookings = await BookingsSchema.countUserBookings(authUser)


        return { staff, patients, communications, bookings }
    } catch (error) {
        throw error
    }
}