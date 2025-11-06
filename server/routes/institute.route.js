import { Router } from "express";

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
import { isInstituteAuth } from "../middleware/auth.middleware.js";
import { createEnrollment, getStudentWithEnrollment } from "../controllers/enrollment.controller.js";
const router = Router();

router.post("/addDepartment", isInstituteAuth, addDepartMent);
router.get("/fetchDepartMent", isInstituteAuth, fetchDepartment);
router.post("/addfaculty", isInstituteAuth, addFaculty);
router.get("/fetchFaculty", isInstituteAuth, fetchFaculty);
router.get("/fetchCourse", isInstituteAuth, fetchCourses);
router.post("/addCourse", isInstituteAuth, addCourse);
router.post("/addStudent", isInstituteAuth, addStudent);
router.get("/fetchStudent", isInstituteAuth, fetchStudents);
router.get("/dashboardSummary", isInstituteAuth, dashboardSummary);
router.get("/student/:student_id/details",isInstituteAuth,getStudentWithEnrollment)
router.post("/enrollment",isInstituteAuth,createEnrollment);
export default router;
