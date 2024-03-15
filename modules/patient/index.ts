import { Router } from "express";
import { Signup } from "./controllers/signup.controller";
import ValidationMiddleware from "../../validation/validation.middleware";
import AppConstants from "../../constants/app.constant";
import PatientValidations from "../../validation/patient.validations";

const router = Router()

router.post("/",
    ValidationMiddleware(
        PatientValidations.create,
        AppConstants.REQUEST_TYPE.BODY,
    ),
    Signup
)

export default router