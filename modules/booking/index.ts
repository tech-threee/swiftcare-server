import { Router } from "express";
import { IS_LOGGEDIN } from "../../middlewares/auth";

const router = Router()

// Make Bookings
router.post("/", IS_LOGGEDIN)

// Fetch my bookings
router.get("/", IS_LOGGEDIN)
router.put("/", IS_LOGGEDIN,)
router.delete("/:id")
router.patch("/change-status/:id", IS_LOGGEDIN)
router.delete("/:id", IS_LOGGEDIN)

export default router