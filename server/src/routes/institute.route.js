import { Router } from "express";
import {
  addDepartMent,
  addFaculty,
  addStudent,
  dashboardSummary,
  fetchDepartment,
  fetchFaculty,
  fetchStudents,
  getFaculty,
  removeFaculty,
  removeStudent,
} from "../controllers/institute.controller.js";
import { addCourse, fetchCourses } from "../controllers/course.controller.js";
import { isInstituteAuth } from "../middleware/auth.middleware.js";
import {
  createEnrollment,
  getStudentWithEnrollment,
} from "../controllers/enrollment.controller.js";
const router = Router();

// Department Routes
router.post("/addDepartment", isInstituteAuth, addDepartMent);
router.get("/fetchDepartMent", isInstituteAuth, fetchDepartment);

// Faculty Routes
router.post("/addfaculty", isInstituteAuth, addFaculty);
router.get("/fetchFaculty", isInstituteAuth, fetchFaculty);
router.delete("/faculty/:faculty_id", isInstituteAuth, removeFaculty);
router.get("/faculty/:faculty_id", isInstituteAuth, getFaculty);

// Course Routes
router.post("/addCourse", isInstituteAuth, addCourse);
router.get("/fetchCourse", isInstituteAuth, fetchCourses);

// Student Routes
router.post("/addStudent", isInstituteAuth, addStudent);
router.get("/fetchStudent", isInstituteAuth, fetchStudents);
router.get(
  "/student/:student_id/details",
  isInstituteAuth,
  getStudentWithEnrollment
);
router.delete("/student/:student_id", isInstituteAuth, removeStudent);

// Enrollment Routes
router.post("/enrollment", isInstituteAuth, createEnrollment);

// Dashboard Route
router.get("/dashboardSummary", isInstituteAuth, dashboardSummary);

export default router;
