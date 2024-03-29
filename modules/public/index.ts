import { Router } from "express";
import { GLOBAL_COUNT } from "./controller";
import { IS_LOGGEDIN } from "../../middlewares/auth";

const router = Router()

router.get("/", IS_LOGGEDIN, GLOBAL_COUNT)

export default router