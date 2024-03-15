import { Router } from 'express';

import StaffLogin from './controllers/staff_login.controller';
import { PatientLogin, PatientVeirfyOtp } from './controllers/patient_login.controller';

const router = Router();

router.post('/staff', StaffLogin);
router.post('/patient', PatientLogin);
router.post('/patient/verify-otp', PatientVeirfyOtp)

// TODO: ADD Refresh token route
// TODO: Verify token route
// TODO: Logout route
// TODO: Forgot password route
// TODO: Reset password route

export default router;
