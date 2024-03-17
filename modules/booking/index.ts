import { Router } from "express";
import { IS_LOGGEDIN } from "../../middlewares/auth";
import { MakeBooking } from "./controllers/add.controller";
import VERIFY from "../../middlewares/verifications"
import { UpdateAppointment } from "./controllers/status.controller";

const router = Router()

// Make Bookings
router.post("/", IS_LOGGEDIN)

// Fetch my bookings
router.get("/", IS_LOGGEDIN, VERIFY.PATIENT, MakeBooking)
// router.put("/", IS_LOGGEDIN, VERIFY.DOCTOR, UpdateAppointment)
router.delete("/:id")
router.patch("/change-status/:id", IS_LOGGEDIN, VERIFY.DOCTOR, UpdateAppointment)
router.delete("/:id", IS_LOGGEDIN)

export default router