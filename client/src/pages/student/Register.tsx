import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStudentAuth } from "@/components/context/StudentAuthProvider"; // Assuming you have this context

function RegisterPage() {
  const { student, enrollmentHistory } = useStudentAuth();
  const [pendingEnrollments, setPendingEnrollments] = useState<any[]>([]);

  useEffect(() => {
    if (enrollmentHistory) {
      const pending = enrollmentHistory.filter((enrollment: any) => enrollment.status === "Pending");
      setPendingEnrollments(pending);
    }
  }, [enrollmentHistory]);

  const handlePayFees = (enrollmentId: string) => {
    // Handle the payment logic here
    console.log(`Paying fees for enrollment ID: ${enrollmentId}`);
  };

  return (
    <div className="space-y-8 p-4 w-full">
      <h1 className="text-3xl font-bold">Pending Enrollment</h1>
      <p className="text-muted-foreground">Your pending enrollment(s), with fees to be paid.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingEnrollments.length > 0 ? (
          pendingEnrollments.map((enrollment) => (
            <motion.div
              key={enrollment.enrollment_id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">Enrollment No: {enrollment.enrollment_no}</h3>
              <p><strong>Status:</strong> {enrollment.status}</p>
              <p><strong>Semester:</strong> {enrollment.semester}</p>
              <p><strong>Fees to be Paid:</strong> ₹{enrollment.fees_paid}</p>

              <button
                onClick={() => handlePayFees(enrollment.enrollment_id)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
              >
                Pay Fees
              </button>
            </motion.div>
          ))
        ) : (
          <div className="text-gray-500">No pending enrollments.</div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
