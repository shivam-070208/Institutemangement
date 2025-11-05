import { client } from "../config/Connectdb.js";

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

    // Get total count for pagination
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
