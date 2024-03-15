import { NextFunction, Response, Request } from "express";
import { IPatient } from "../../../interfaces/patient.interface";
import PatientSchema from "../schema";
import ResponseHandler from "../../../handlers/response.handler";
import ApiError from "../../../utils/apiError";
import NewPatientAccountTemplate from '../../../services/mail/templates/new_patient_account.template';
import { SendEmail } from "../../../services/mail";
export const Signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload: IPatient = req.body

        const pid = new Date().getTime().toString()

        const patientExist = await PatientSchema.patientWithPropExists({ email: payload.email, phone: payload.phone })

        if (patientExist) return next(new ApiError("Patient Already Exist"))

        const newPatient = await PatientSchema.addSingle({
            ...payload,
            pid
        })

        // send user email
        const messageTemplate = NewPatientAccountTemplate({
            name: payload.name,
            email: payload.email,
            id: pid,
        });

        SendEmail({
            email: payload.email,
            subject: 'Welcome to SwiftCare Connect',
            message: messageTemplate,
        });

        return new ResponseHandler(res).successWithData(
            newPatient
        )
    } catch (error) {
        next(error)
    }
}