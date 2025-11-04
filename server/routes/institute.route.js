import { Router } from "express";
import { isAuth } from "../middleware/auth.middleware";
import { addDepartMent, fetchDepartMent } from "../controllers/institute.controller";
const router = Router();

router.put('/addDepartment',isAuth,addDepartMent);
router.get('/fetchDepartMent',isAuth,fetchDepartMent);


export default router;