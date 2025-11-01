import { Router } from "express";
import { getDemo } from "../controllers/democontroller.js";

const router = Router();

// Sample route for getting student information
router.get("/:id", getDemo);


export default router;
