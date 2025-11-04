import { Router } from "express";
import { getUser, InstituteLogin, InstituteSignup } from "../controllers/institute.auth.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", InstituteLogin);
router.post("/signup", InstituteSignup);
router.post("/getuser",isAuth,getUser)
export default router;
