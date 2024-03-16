import { NextFunction, Response, Request } from 'express';
import BookingSchema from '../schema';
import ResponseHandler from '../../../handlers/response.handler';
import ApiError from '../../../utils/apiError';
import NewPatientAccountTemplate from '../../../services/mail/templates/new_patient_account.template';
import { SendEmail } from '../../../services/mail';
import { IBooking } from '../../../interfaces/booking.interface';
export const MakeBooking = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const payload: IBooking = req.body;


        // const newBooking = await BookingSchema.create({
        //     ...payload,
        //     pid,
        // });

        // // send user email
        // const messageTemplate = NewPatientAccountTemplate({
        //     name: payload.name,
        //     email: payload.email,
        //     id: pid,
        // });

        // new ResponseHandler(res).successWithData(newPatient);
        // await SendEmail({
        //     email: payload.email,
        //     subject: 'Welcome to SwiftCare Connect',
        //     message: messageTemplate,
        // });
    } catch (error) {
        next(error);
    }
};
