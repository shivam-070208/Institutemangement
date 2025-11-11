import { client } from "../../config/Connectdb.js";
import bcrypt from "bcryptjs";

/**
 * Department Controllers
 */

// Add a department
export const addDepartMent = async (req, res) => {
  try {
    const { Name, HOD, Contact_Mail } = req.body;
    const uid = req.user?.id;

    if (!uid || !Name || !HOD || !Contact_Mail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const deptCheck = await client.query(
      `SELECT * FROM department WHERE uid = $1 AND LOWER(name) = LOWER($2)`,
      [uid, Name]
    );
    if (deptCheck.rows.length > 0) {
      return res.status(409).json({ message: "Department already exists" });
    }

    const query = `
      INSERT INTO department (uid, name, head_of_department, contact_email)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [uid, Name, HOD, Contact_Mail];

    const result = await client.query(query, values);
    res.status(201).json({
      success: true,
      message: "Department added successfully",
      department: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Fetch all departments
export const fetchDepartment = async (req, res) => {
  try {
    const uid = req.user?.id;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM department WHERE uid = $1 LIMIT $2 OFFSET $3;
    `;

    const result = await client.query(query, [uid, limit, offset]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }
    res.status(200).json({
      departments: result.rows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(result.rowCount / limit),
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Server-side error" });
  }
};

/**
 * Faculty Controllers
 */

// Add faculty
export const addFaculty = async (req, res) => {
  try {
    const uid = req.user?.id;
    const { name, subjects, contact_email, password } = req.body;

    if (!uid || !name || !subjects || !contact_email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const facCheck = await client.query(
      `SELECT * FROM faculty WHERE uid = $1 AND LOWER(contact_email) = LOWER($2)`,
      [uid, contact_email]
    );
    if (facCheck.rows.length > 0) {
      return res.status(409).json({ message: "Faculty already exists" });
    }

    const insertQuery = `
      INSERT INTO faculty (uid, name, subjects, contact_email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const result = await client.query(insertQuery, [
      uid,
      name,
      subjects,
      contact_email,
      password
    ]);

    res.status(201).json({
      message: "Faculty added successfully",
      faculty: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding faculty:", error);
    res.status(500).json({ message: "Server-side error" });
  }
};

// Fetch all faculty
export const fetchFaculty = async (req, res) => {
  try {
    const uid = req.user?.id;
    const { page = 1, limit = 5 } = req.query;

    if (!uid) return res.status(400).json({ message: "Invalid user. Please login again." });

    const offset = (page - 1) * limit;

    const facultyResult = await client.query(
      `SELECT id AS faculty_id, name, subjects, contact_email, created_at
       FROM faculty WHERE uid = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [uid, limit, offset]
    );

    const countResult = await client.query(
      `SELECT COUNT(*) AS total FROM faculty WHERE uid = $1`,
      [uid]
    );

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      faculty: facultyResult.rows,
      totalPages,
      total,
    });
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ message: "Server-side error" });
  }
};

// Remove faculty
export const removeFaculty = async (req, res) => {
  try {
    const uid = req.user.id;
    const faculty_id = req.params.faculty_id;

    // Check if the faculty exists and belongs to the current university/institute
    const checkQuery = `SELECT * FROM faculty WHERE faculty_id = $1 AND uid = $2`;
    const { rowCount } = await client.query(checkQuery, [faculty_id, uid]);
    if (rowCount === 0) {
      return res.status(404).json({ message: "Faculty not found or not under your institute" });
    }

    // Perform delete
    await client.query(`DELETE FROM faculty WHERE faculty_id = $1 AND uid = $2`, [faculty_id, uid]);

    return res.json({ message: "Faculty removed successfully" });
  } catch (error) {
    console.error("Error removing faculty:", error);
    return res.status(500).json({ message: "Server-side error" });
  }
};

// Get faculty details by faculty_id
export const getFaculty = async (req, res) => {
  try {
    const uid = req.user.id;
    const faculty_id = req.params.faculty_id;

    // Fetch faculty (check if it belongs to the current institute)
    const result = await client.query(
      `SELECT faculty_id, name, contact_email, subjects, uid FROM faculty WHERE faculty_id = $1 AND uid = $2`,
      [faculty_id, uid]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Faculty not found or not under your institute" });
    }

    // (Optional) Convert subjects array to human-readable if needed
    const faculty = result.rows[0];
    if (Array.isArray(faculty.subjects)) {
      faculty.subjects = faculty.subjects.map(subject => subject.trim());
    }

    return res.json({ faculty });
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return res.status(500).json({ message: "Server-side error" });
  }
};

/**
 * Student Controllers
 */

// Add student
export const addStudent = async (req, res) => {
  try {
    const uid = req.user?.id;
    const { name, email, phone, department_id, semester, section, password } = req.body;

    if (!name || !email || !department_id || !semester || !section || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const studentCheck = await client.query(
      `SELECT * FROM student WHERE uid = $1 AND department_id = $2 AND LOWER(email) = LOWER($3)`,
      [uid, department_id, email]
    );
    if (studentCheck.rows.length > 0) {
      return res.status(409).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO student (uid, department_id, name, email, phone, semester, section, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [uid, department_id, name, email, phone || null, semester, section, hashedPassword];

    const { rows } = await client.query(query, values);

    return res.status(201).json({ message: "Student added successfully ✅", student: rows[0] });

  } catch (error) {
    console.error("Error adding student:", error);
    return res.status(500).json({ message: "Server-side error" });
  }
};

// Fetch all students
export const fetchStudents = async (req, res) => {
  try {
    const uid = req.user?.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const query = `
      SELECT s.student_id, s.name, s.email, s.phone, s.semester, s.section, d.name AS department
      FROM student s
      JOIN department d ON s.department_id = d.department_id
      WHERE s.uid = $1
      ORDER BY s.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const values = [uid, limit, offset];

    const { rows } = await client.query(query, values);

    const countQuery = `SELECT COUNT(*) FROM student WHERE uid = $1`;
    const totalStudents = (await client.query(countQuery, [uid])).rows[0].count;
    const totalPages = Math.ceil(totalStudents / limit);

    return res.json({ students: rows, totalPages });

  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ message: "Server-side error" });
  }
};

// Remove student
export const removeStudent = async (req, res) => {
  try {
    const uid = req.user.id;
    const student_id = req.params.student_id;

    // Check if the student exists and belongs to the current university
    const checkQuery = `SELECT * FROM student WHERE student_id = $1 AND uid = $2`;
    const { rowCount } = await client.query(checkQuery, [student_id, uid]);
    if (rowCount === 0) {
      return res.status(404).json({ message: "Student not found or not under your institute" });
    }

    // Perform delete
    await client.query(`DELETE FROM student WHERE student_id = $1 AND uid = $2`, [student_id, uid]);

    return res.json({ message: "Student removed successfully" });
  } catch (error) {
    console.error("Error removing student:", error);
    return res.status(500).json({ message: "Server-side error" });
  }
};

/**
 * Dashboard Controllers
 */

// Dashboard summary
export const dashboardSummary = async (req, res) => {
  try {
    const uid = req.user.id;

    const q = async (sql) => (await client.query(sql, [uid])).rows[0]?.count || 0;

    const departments = await q(`SELECT COUNT(*) FROM department WHERE uid = $1`);
    const faculty = await q(`SELECT COUNT(*) FROM faculty WHERE uid = $1`);
    const courses = await q(`SELECT COUNT(*) FROM course WHERE uid = $1`);
    const students = await q(`SELECT COUNT(*) FROM student WHERE uid = $1`);

    const recentStudents = (await client.query(`
      SELECT s.student_id, s.name, d.name AS department, s.semester, s.section
      FROM student s
      JOIN department d ON s.department_id = d.department_id
      WHERE s.uid = $1
      ORDER BY s.created_at DESC
      LIMIT 10
    `, [uid])).rows;

    res.json({ departments, faculty, courses, students, recentStudents });
  } catch (err) {
    res.status(500).json({ message: "Dashboard fetch error" });
  }
};
