import { NextFunction, Response, Request } from "express";
import { IPatient } from "../../../interfaces/patient.interface";
import PatientSchema from "../schema";
import ResponseHandler from "../../../handlers/response.handler";

export const Signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload: IPatient = req.body

        const pid = new Date().getTime().toString()

        const newPatient = await PatientSchema.addSingle({
            ...payload,
            pid
        })

        return new ResponseHandler(res).successWithData({
            ...newPatient
        })
    } catch (error) {
        next(error)
    }
}