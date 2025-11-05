import { client } from "../config/Connectdb.js";

export const addCourse = async (req, res) => {
  try {
    const uid = req.user?.id; // University ID from JWT
    const { departments, name, code, description, credit_hours, semester } = req.body;
    console.log(departments,name,code,description,credit_hours,semester);
    
    if (!departments || !name || !code) {
      return res.status(400).json({ message: "Department, name, and code are required." });
    }

    const query = `
      INSERT INTO course (uid, department_id, name, code, description, credit_hours, semester)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [uid, departments, name, code, description || "", credit_hours || 0, semester || 1];

    const { rows } = await client.query(query, values);

    res.status(201).json({ message: "Course added successfully", course: rows[0] });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ message: "Server-side error" });
  }
};

//* Fetch courses for pagination and university-specific courses
export const fetchCourses = async (req, res) => {
  try {
    const uid = req.user?.id; // University ID from JWT
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Fetch courses for the university
    const query = `
      SELECT * FROM course
      WHERE uid = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const values = [uid, limit, offset];

    const { rows } = await client.query(query, values);

    // Count total courses for pagination
    const countQuery = `SELECT COUNT(*) FROM course WHERE uid = $1`;
    const countRes = await client.query(countQuery, [uid]);
    const totalCourses = parseInt(countRes.rows[0].count, 10);
    const totalPages = Math.ceil(totalCourses / limit);

    res.json({ courses: rows, totalPages });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server-side error" });
  }
};
