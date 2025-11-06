import { Router } from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  addDepartMent,
  addFaculty,
  addStudent,
  dashboardSummary,
  fetchDepartment,
  fetchFaculty,
  fetchStudents,
} from "../controllers/institute.controller.js";
import { addCourse, fetchCourses } from "../controllers/course.controller.js";
const router = Router();

router.put("/addDepartment", isAuth, addDepartMent);
router.get("/fetchDepartMent", isAuth, fetchDepartment);
router.put("/addfaculty", isAuth, addFaculty);
router.get("/fetchFaculty", isAuth, fetchFaculty);
router.get("/fetchCourse", isAuth, fetchCourses);
router.put("/addCourse", isAuth, addCourse);
router.put("/addStudent", isAuth, addStudent);
router.get("/fetchStudent", isAuth, fetchStudents);
router.get("/dashboardSummary", isAuth, dashboardSummary);
export default router;
