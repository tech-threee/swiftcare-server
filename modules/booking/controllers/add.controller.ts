import { NextFunction, Response, Request } from 'express';
import BookingSchema from '../schema';
import ResponseHandler from '../../../handlers/response.handler';
import ApiError from '../../../utils/apiError';
import NewBookingPatientTemplate from '../../../services/mail/templates/patient_booking.template';
import NewBookingDoctorTemplate from '../../../services/mail/templates/doctor_booking.template';
import { SendEmail } from '../../../services/mail';
import { IBooking } from '../../../interfaces/booking.interface';
import mongoose from 'mongoose';
import AppConstants from '../../../constants/app.constant';
import { isISOString } from '../../../utils/functions';
export const MakeBooking = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const payload: IBooking = req.body;
        // add it to req as req.user)
        const authUser: { id: string; role: string; _id: mongoose.Types.ObjectId } = req.user;
        const patient: { name: string, email: string } = req.body.patient


        if (!isISOString(payload.date)) {
            return new ResponseHandler(res).failure("Date must be an ISO String")
        }

        if (!Object.keys(AppConstants.SPECIALITIES).includes(payload.issue)) {
            return new ResponseHandler(res).error(new ApiError(`${payload.issue} does not much overload ${Object.keys(AppConstants.SPECIALITIES).toString()}`))
        }

        const doctor = await BookingSchema.LookupDoctor({ specialty: AppConstants.SPECIALITIES[payload.issue], date: payload.date })

        if (!doctor) return new ResponseHandler(res).failure(`No Doctor found for your issue at the moment`)

        const newBookings = await BookingSchema.create({
            ...payload,
            doctor: doctor._id,
            patient: authUser._id,
            status: AppConstants.BOOKING_STATUSES.PENDING
        })
        // send user email
        const patientMessageTemplate = NewBookingPatientTemplate({
            name: patient.name,
            date: payload.date,
            doctor: doctor.name,
            status: AppConstants.BOOKING_STATUSES.PENDING
        });
        const doctorMessageTemplate = NewBookingDoctorTemplate({
            name: doctor.name,
            date: payload.date,
            patient: {
                ...patient,
                pid: authUser.id
            },
            status: AppConstants.BOOKING_STATUSES.PENDING
        });

        new ResponseHandler(res).successWithData(newBookings);

        // send patient mail
        SendEmail({
            email: patient.email,
            subject: 'Confirmed Appointment Booking',
            message: patientMessageTemplate,
        });

        // send patient mail
        SendEmail({
            email: doctor.email,
            subject: 'New Patient Appointment',
            message: doctorMessageTemplate,
        });
    } catch (error) {
        next(error);
    }
};
