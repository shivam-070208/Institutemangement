import { Router } from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import { addDepartMent, fetchDepartment } from "../controllers/institute.controller.js";
const router = Router();

router.put('/addDepartment',isAuth,addDepartMent);
router.get('/fetchDepartMent',isAuth,fetchDepartment);


export default router;