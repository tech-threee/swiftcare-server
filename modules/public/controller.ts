import { NextFunction, Request, Response } from "express";
import { FETCH_COUNTS } from "./schema";
import ResponseHandler from "../../handlers/response.handler";
import mongoose from "mongoose";

export const GLOBAL_COUNT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // add it to req as req.user)
        const authUser: { id: string; role: string; _id: mongoose.Types.ObjectId } = req.user;
        const count: { staff: {}, bookings: number, communications: number, patients: number } = await FETCH_COUNTS(authUser)

        return new ResponseHandler(res).successWithData({
            ...count
        })
    } catch (error) {
        next(error)
    }
}