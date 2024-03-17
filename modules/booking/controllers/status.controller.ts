import { NextFunction, Response, Request } from 'express';
import BookingSchema from '../schema';
import ResponseHandler from '../../../handlers/response.handler';
import ApiError from '../../../utils/apiError';
import UpdatePatientBooking from '../../../services/mail/templates/booking_update.template';
import { SendEmail } from '../../../services/mail';
import { IBooking } from '../../../interfaces/booking.interface';
import mongoose from 'mongoose';
import AppConstants from '../../../constants/app.constant';
import { CastToId } from '../../../utils/functions';
export const UpdateAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const payload: IBooking = req.body;
        const bookingId = CastToId(req.params.id)
        // add it to req as req.user)
        const authUser: { id: string; role: string; _id: mongoose.Types.ObjectId } = req.user;
        const patient: { name: string, email: string } = req.body.patient

        if (Object.keys(AppConstants.BOOKING_STATUSES).includes(payload.status)) {
            return new ResponseHandler(res).error(new ApiError(`${payload.status} does not much overload ${Object.keys(AppConstants.BOOKING_STATUSES).toString()}`))
        }

        // booking exist
        const isBookingExist = await BookingSchema.fetchOneById(bookingId)

        if (!isBookingExist) return new ResponseHandler(res).failure("Booking not found")

        if (isBookingExist.doctor.toString() !== req.params.id) {
            return new ResponseHandler(res).error(new ApiError("Forbidden Access"))
        }

        const updatedBooking = await BookingSchema.changeBookingStatus(bookingId, payload.status)
        // send user email
        const patientMessageTemplate = UpdatePatientBooking({
            name: patient.name,
            date: payload.date,
            status: payload.status
        });

        new ResponseHandler(res).successWithData(updatedBooking);

        // send patient mail
        SendEmail({
            email: patient.email,
            subject: 'Appointment Status Update',
            message: patientMessageTemplate,
        });
    } catch (error) {
        next(error);
    }
};
