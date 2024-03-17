import { BOOKING, COMMUNICATION, PATIENT, STAFF } from "../../models"

export const FETCH_COUNTS = async (): Promise<{ staff: number, bookings: number, communications: number, patients: number }> => {
    try {
        const staff = await STAFF.countDocuments()
        const patients = await PATIENT.countDocuments()
        const communications = await COMMUNICATION.countDocuments()
        const bookings = await BOOKING.countDocuments()


        return { staff, patients, communications, bookings }
    } catch (error) {
        throw error
    }
}