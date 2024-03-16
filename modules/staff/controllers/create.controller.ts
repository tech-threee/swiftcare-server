import { NextFunction, Response, Request } from 'express';
import { IStaff } from '../../../interfaces/staff.interface';
import StaffSchema from '../schema';
import ResponseHandler from '../../../handlers/response.handler';
import ApiError from '../../../utils/apiError';
import { SendEmail } from '../../../services/mail';
import new_accountTemplate from '../../../services/mail/templates/new_account.template';
import { BcryptPassword } from '../../../utils/auth';
import AppConstants from '../../../constants/app.constant';
export const CreateStaff = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const {
        name,
        email,
        dob,
        phone,
        sid,
        role,
        specialty,
        emergency_contacts,
        image,
        pin,
    } = req.body;
    try {

        if (!name || !email || !dob || !phone || !role || !specialty) {
            return new ResponseHandler(res).failure("Some required fields are missing")
        }

        if (!Object.keys(AppConstants.MODULES).includes(role)) {
            return new ResponseHandler(res).failure("Role must in eait of these " + Object.keys(AppConstants.MODULES).toString())
        }

        const payload: IStaff = req.body;

        const patientWithPhoneExist = await StaffSchema.isExistingPhone(
            payload.phone,
        );
        const patientWithEmailExist = await StaffSchema.isExistingEmail(
            payload.email,
        );

        const sid = new Date().getTime().toString();
        const { PIN, HashedPIN } = await BcryptPassword(6);
        if (patientWithEmailExist || patientWithPhoneExist)
            return next(new ApiError('Patient Already Exist'));

        const newPatient = await StaffSchema.addSingle({
            ...payload,
            sid,
            pin: HashedPIN,
        });

        // send user email
        const messageTemplate = new_accountTemplate({
            name: payload.name,
            sid,
            pin: PIN,
        });

        SendEmail({
            email: payload.email,
            subject: 'Welcome to SwiftCare Staff Account',
            message: messageTemplate,
        });
        // console.log(newPatient._doc)
        new ResponseHandler(res).successWithData(newPatient);
    } catch (error) {
        next(error);
    }
};
