import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStudentAuth } from "@/components/context/StudentAuthProvider";
import StripeCheckoutProvider from "@/components/context/StripeCheckoutProvider";
import CheckoutForm from "@/components/common/CheckoutForm";
import { toast } from "sonner";

function RegisterPage() {
  const { student, enrollmentHistory } = useStudentAuth();
  const [pendingEnrollments, setPendingEnrollments] = useState<any[]>([]);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  useEffect(() => {
    if (enrollmentHistory) {
      const pending = enrollmentHistory.filter(
        (enrollment: any) => enrollment.status === "Pending"
      );
      setPendingEnrollments(pending);
    }
  }, [enrollmentHistory]);

  const handlePayFees = (enrollmentId) => {
    
    const enrollment = pendingEnrollments.find(
      (enr) => enr.enrollment_id === enrollmentId.enrollment_id
    );

    if (enrollment) {
      setSelectedEnrollment(enrollment);
      setShowStripeCheckout(true);
    }
  };
  const handleconfirmPayment = async (item: number) => {
    try {
      const body = JSON.stringify({ enrollment_id: item, status: "Active" });
      const res =await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/student/updateEnrollment`,
        {
          method: "PUT",
          body,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if(!res.ok) return toast(data.message);
      setPendingEnrollments(pendingEnrollments.filter(item => item !== selectedEnrollment));
      handleCloseStripe();;
    } catch (error) {
      console.log(error);
      toast(error.message);
    }
  };
  const handleCloseStripe = () => {
    setShowStripeCheckout(false);
    setSelectedEnrollment(null);
  };

  return (
    <div className="space-y-8 p-4 w-full">
      <h1 className="text-3xl font-bold">Pending Enrollment</h1>
      <p className="text-muted-foreground">
        Your pending enrollment(s), with fees to be paid.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingEnrollments.length > 0 ? (
          pendingEnrollments.map((enrollment) => (
            <motion.div
              key={enrollment.enrollment_id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">
                Enrollment No: {enrollment.enrollment_no}
              </h3>
              <p>
                <strong>Status:</strong> {enrollment.status}
              </p>
              <p>
                <strong>Semester:</strong> {enrollment.semester}
              </p>
              <p>
                <strong>Fees to be Paid:</strong> ₹{enrollment.fees_paid}
              </p>

              <button
                onClick={() => handlePayFees(enrollment)}
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

      {showStripeCheckout && selectedEnrollment !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg relative shadow-xl min-w-[350px]">
            <button
              onClick={handleCloseStripe}
              className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <StripeCheckoutProvider amount={Number( selectedEnrollment.fees_paid)}>
              <CheckoutForm
                handleconfirmPayment={handleconfirmPayment}
                enrollmentId={selectedEnrollment.enrollment_id}
              />
            </StripeCheckoutProvider>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
