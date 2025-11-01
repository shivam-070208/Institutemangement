import { Router } from "express";
import { InstituteLogin } from "../controllers/InstituteAuthController";

const router = Router();

router.post("/login", InstituteLogin);

export default router;
