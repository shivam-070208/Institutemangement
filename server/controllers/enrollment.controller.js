import { client } from "../config/Connectdb.js";

export const getStudentWithEnrollment = async (req, res) => {
  try {
    const student_id = req.params.student_id ?? req.user.student_id;

    if (!student_id) {
      return res.status(400).json({ message: "student_id is required" });
    }

    const studentQuery = `
        SELECT 
          student_id, name, email, phone, department_id, semester, section, created_at
        FROM student
        WHERE student_id = $1
        LIMIT 1;
      `;
    const studentResult = await client.query(studentQuery, [student_id]);

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = studentResult.rows[0];

    // ✅ Fetch Enrollment History Sorted by Semester
    const enrollmentQuery = `
        SELECT 
          enrollment_id, department_id, enrollment_no, status, semester, fees_paid, created_at
        FROM enrollment
        WHERE student_id = $1
        ORDER BY semester ASC;
      `;
    const enrollmentResult = await client.query(enrollmentQuery, [student_id]);

    return res.status(200).json({
      student,
      enrollmentHistory: enrollmentResult.rows,
    });
  } catch (error) {
    console.error("Error fetching student with enrollment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const createEnrollment = async (req, res) => {
  try {
    const { student_id, department_id, enrollment_no, semester, fees_paid } =
      req.body;

    // Validate input
    if (!student_id || !department_id || !enrollment_no || !semester) {
      return res
        .status(400)
        .json({ message: "All fields except status are required" });
    }

    // Default status is 'Pending', so we don’t need to pass it in the request body
    const status = "Pending";

    // Insert the new enrollment into the database
    const enrollmentQuery = `
        INSERT INTO enrollment (student_id, department_id, enrollment_no, status, semester, fees_paid)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING enrollment_id, student_id, department_id, enrollment_no, status, semester, fees_paid, created_at;
      `;

    const enrollmentResult = await client.query(enrollmentQuery, [
      student_id,
      department_id,
      enrollment_no,
      status,
      semester,
      fees_paid,
    ]);

    const newEnrollment = enrollmentResult.rows[0];

    return res.status(201).json({
      message: "Enrollment created successfully",
      enrollment: newEnrollment,
    });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateEnrollment = async (req, res) => {
  try {
    const { status,enrollment_id } = req.body;
    if (!enrollment_id || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const updateQuery = `
      UPDATE enrollment
      SET status = $1
      WHERE enrollment_id = $2
      RETURNING *;
    `;
    const values = [status, enrollment_id];
    const result = await client.query(updateQuery, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    return res.status(200).json({ message: "Enrollment updated successfully" });
    } catch (error) {
    console.error("Error updating enrollment");
    res.status(500).json({ message: "Internal Server Error" });
  }
};