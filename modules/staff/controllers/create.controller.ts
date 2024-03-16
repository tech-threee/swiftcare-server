import { NextFunction, Response, Request } from "express";
import { IStaff } from "../../../interfaces/staff.interface";
import StaffSchema from "../schema";
import ResponseHandler from "../../../handlers/response.handler";
import ApiError from "../../../utils/apiError";
import { SendEmail } from "../../../services/mail";
import new_accountTemplate from "../../../services/mail/templates/new_account.template";
import { BcryptPassword } from "../../../utils/auth";
export const CreateStaff = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload: IStaff = req.body


        const patientWithPhoneExist = await StaffSchema.isExistingPhone(payload.phone)
        const patientWithEmailExist = await StaffSchema.isExistingEmail(payload.email)

        const sid = new Date().getTime().toString()
        const { PIN, HashedPIN } = await BcryptPassword(6)
        if (patientWithEmailExist || patientWithPhoneExist) return next(new ApiError("Patient Already Exist"))

        const newPatient = await StaffSchema.addSingle({
            ...payload,
            sid,
            pin: HashedPIN
        })

        // send user email
        const messageTemplate = new_accountTemplate({
            name: payload.name,
            sid,
            pin: sid,
        });


        new ResponseHandler(res).successWithData(
            newPatient
        )
        await SendEmail({
            email: payload.email,
            subject: 'Welcome to SwiftCare Staff Account',
            message: messageTemplate,
        });
    } catch (error) {
        next(error)
    }
}