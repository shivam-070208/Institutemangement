import { client } from "../config/Connectdb.js";
import bcrypt from "bcryptjs";
export const addDepartMent = async (req, res) => {
  try {
    const { Name, HOD, Contact_Mail } = req.body;
    const uid = req.user?.id;
    
    if (!uid || !Name || !HOD || !Contact_Mail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const query = `
      INSERT INTO department (uid,name, head_of_department,contact_email)
      VALUES ($1, $2, $3,$4)
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

export const fetchDepartment = async (req, res) => {
  try {
    const uid  = req.user?.id;
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
export const addFaculty = async (req, res) => {
  try {
    const uid = req.user?.id;
    const { name, subjects, contact_email,password } = req.body;

    // Basic validation
    if (!uid || !name || !subjects || !contact_email||!password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Insert query
    const insertQuery = `
      INSERT INTO faculty (uid, name, subjects, contact_email,password)
      VALUES ($1, $2, $3, $4,$5)
      RETURNING *;
    `;

    // Execute query
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


export const fetchFaculty = async (req, res) => {
  try {
    const uid = req.user?.id;
    const { page = 1, limit = 5 } = req.query;

    if (!uid) return res.status(400).json({ message: "Invalid user. Please login again." });

    const offset = (page - 1) * limit;

    // Fetch paginated faculty
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
export const addStudent = async (req, res) => {
  try {
    const uid = req.user?.id; // university id from auth middleware
    const { name, email, phone, department_id, semester, section, password } = req.body;

    if (!name || !email || !department_id || !semester || !section || !password) {
      return res.status(400).json({ message: "All fields are required." });
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
