import express, { NextFunction, Request, Response, Router } from 'express';
import { Mail } from '../middlewares/mail';
import { COMMUNICATION_MODULE, STAFF_MODULE, AUTH_MODULE, PATIENT_MODULE } from '../modules';

const router = Router();
const app = express();

router.use('/auth', AUTH_MODULE);
router.use('/communication', COMMUNICATION_MODULE);
router.use("/patient", PATIENT_MODULE)
router.use("/staff", STAFF_MODULE)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Welcome to the API',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/mail', Mail);

export default router;
