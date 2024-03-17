import { NextFunction, Request, Response } from "express";
import { FETCH_COUNTS } from "./schema";
import ResponseHandler from "../../handlers/response.handler";

export const GLOBAL_COUNT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const count: { staff: number, bookings: number, communications: number, patients: number } = await FETCH_COUNTS()

        return new ResponseHandler(res).successWithData({
            ...count
        })
    } catch (error) {
        next(error)
    }
}