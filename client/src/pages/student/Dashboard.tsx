import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DataTable } from "@/components/common/DataTable";
import { useStudentAuth } from "@/components/context/StudentAuthProvider";

function StudentDashboard() {
  const { student, enrollmentHistory } = useStudentAuth();
  const [currentSemester, setCurrentSemester] = useState<number | null>(null);

  useEffect(() => {
    if (enrollmentHistory?.length > 0) {
      const highestSem = Math.max(...enrollmentHistory.map((e: any) => e.semester));
      setCurrentSemester(highestSem);
    } 
  }, [student, enrollmentHistory]);

  const columns = [
    { key: "enrollment_no", label: "Enrollment No" },
    { key: "status", label: "Status" },
    { key: "semester", label: "Semester" },
    { key: "fees_paid", label: "Fees Paid" },
  ];

  return (
    <div className="space-y-8 p-4 w-full">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      <p className="text-muted-foreground">Your academic profile & progress</p>

      {student && (
        <>
          {/* Student Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border space-y-3"
          >
            <h2 className="text-2xl font-bold">Profile</h2>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {student.phone}</p>
            <p><strong>Department:</strong> {student.department_id}</p>
            <p><strong>Current Semester:</strong> {currentSemester ?? "Not enrolled"}</p>
            <p><strong>Section:</strong> {student.section}</p>
          </motion.div>

          {/* Enrollment Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Enrollment History</h2>
            <DataTable
              data={enrollmentHistory}
              columns={columns}
              searchPlaceholder="Search enrollments..."
            />
          </div>
        </>
      )}
    </div>
  );
}

export default StudentDashboard;
