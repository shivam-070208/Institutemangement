import { client } from "../config/Connectdb.js";

export const addDepartMent = async (req, res) => {
  try {
    const { Name, HOD, Contact_Mail } = req.body;
    const uid = req.user?.uid;
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
    const { uid } = req.user;
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
