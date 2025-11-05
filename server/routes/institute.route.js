import { Router } from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import { addDepartMent, addFaculty, fetchDepartment, fetchFaculty } from "../controllers/institute.controller.js";
import { addCourse, fetchCourses } from "../controllers/course.controller.js";
const router = Router();

router.put('/addDepartment',isAuth,addDepartMent);
router.get('/fetchDepartMent',isAuth,fetchDepartment);
router.put('/addfaculty',isAuth,addFaculty);
router.get("/fetchFaculty", isAuth, fetchFaculty);
router.get("/fetchCourse",isAuth,fetchCourses);
router.put("/addCourse",isAuth,addCourse)
export default router;