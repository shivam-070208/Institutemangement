import { Router } from "express";
import { getUser, InstituteLogin, InstituteSignup } from "../controllers/InstituteAuthController.js";
import { isAuth } from "../middleware/isAuthMiddleware.js";

const router = Router();

router.post("/login", InstituteLogin);
router.post("/signup", InstituteSignup);
router.post("/getuser",isAuth,getUser)
export default router;
