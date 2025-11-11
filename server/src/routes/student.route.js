import { Router } from "express";
import { getStudent, initiatePayment, login } from "../controllers/student.controller.js";
import { isStudentAuth } from "../middleware/auth.middleware.js";
import { getStudentWithEnrollment, updateEnrollment } from "../controllers/enrollment.controller.js";

const router = Router();

router.post("/login", login);
router.get("/fetchuser",isStudentAuth,getStudent);
router.get('/studentWithEnrollment',isStudentAuth,getStudentWithEnrollment);
router.post('/initiatepayment',isStudentAuth,initiatePayment);
router.put('/updateEnrollment',isStudentAuth,updateEnrollment);
export default router ;