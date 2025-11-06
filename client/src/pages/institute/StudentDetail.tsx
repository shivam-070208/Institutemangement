import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";

function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [newEnrollment, setNewEnrollment] = useState({
    department_id: "",
    enrollment_no: "",
    semester: 1,
    fees_paid: 0,
  });

  useEffect(() => {
    fetchStudentDetail(id);
    fetchStudentEnrollments(id);
  }, [id]);

  const fetchStudentDetail = async (studentId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/institute/student/${studentId}/details`, {
        credentials: "include",
      });
      const data = await res.json();
      setStudent(data.student);
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast("Error fetching student details ⚠️");
    }
  };

  const fetchStudentEnrollments = async (studentId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/institute/student/${studentId}/details`, {
        credentials: "include",
      });
      const data = await res.json();
      setEnrollments(data.enrollmentHistory || []);
    } catch (error) {
      console.error("Error fetching student enrollments:", error);
      toast("Error fetching enrollments ⚠️");
    }
  };

  const handleAddEnrollment = async () => {
    if ( !newEnrollment.enrollment_no || !newEnrollment.semester) {
      return toast("Please fill all the required fields ⚠️");
    }
    newEnrollment.department_id = student.department_id;

    try {
        const body = {...newEnrollment, student_id: id};
        console.log(body);
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/institute/enrollment`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) return toast(data.message || "Failed to add enrollment ⚠️");
      
      setEnrollments((prev) => [...prev, data.enrollment]);
      setShowEnrollmentModal(false);
      setNewEnrollment({ department_id: "", enrollment_no: "", semester: 1, fees_paid: 0 });
      toast("Enrollment Added Successfully 🎉");
    } catch (error) {
      toast("An error occurred. Please try again ⚠️");
    }
  };

  const enrollmentColumns = [
    { key: "enrollment_no", label: "Enrollment No" },
    { key: "status", label: "Status" },
    { key: "semester", label: "Semester" },
    { key: "fees_paid", label: "Fees Paid" },
  ];

  return (
    <div className="space-y-8 p-4 w-full">
      {student && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Student Detail</h1>
            <div
          onClick={() => setShowEnrollmentModal(true)}
          className="flex bg-white border-neutral-200 border cursor-pointer items-center font-semibold h-fit px-4 py-2 rounded-sm shadow-input"
        >
          <IconPlus size={15} /> Add
        </div>          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
            <h2 className="text-xl font-semibold">Student Info</h2>
            <div className="space-y-4 mt-4">
              <div><strong>Name:</strong> {student.name}</div>
              <div><strong>Email:</strong> {student.email}</div>
              <div><strong>Phone:</strong> {student.phone}</div>
              <div><strong>Department:</strong> {student.department_id}</div>
              <div><strong>Semester:</strong> {student.semester}</div>
              <div><strong>Section:</strong> {student.section}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Enrollment History</h2>
            <DataTable data={enrollments} columns={enrollmentColumns} searchPlaceholder="Search enrollments..." />
          </div>
        </>
      )}

      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 -top-10 backdrop-blur-md z-40"
          onClick={() => setShowEnrollmentModal(false)}
        />
      )}

      {showEnrollmentModal && (
        <motion.div
          layoutId="add-enrollment-popup"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          className="fixed -top-2 max-h-[90vh] overflow-y-auto right-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 w-[90%] max-w-md shadow-lg z-50"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add Enrollment</h2>
          </div>

          <div className="space-y-4">
          

            <Label>Enrollment No</Label>
            <Input
              type="text"
              placeholder="Enter Enrollment No"
              value={newEnrollment.enrollment_no}
              onChange={(e) =>
                setNewEnrollment({ ...newEnrollment, enrollment_no: e.target.value })
              }
            />

            <Label>Semester</Label>
            <Input
              type="number"
              placeholder="Enter Semester"
              value={newEnrollment.semester}
              onChange={(e) =>
                setNewEnrollment({ ...newEnrollment, semester: Number(e.target.value) })
              }
            />

            <Label>Fees Paid</Label>
            <Input
              type="number"
              placeholder="Enter Fees Paid"
              value={newEnrollment.fees_paid}
              onChange={(e) =>
                setNewEnrollment({ ...newEnrollment, fees_paid: Number(e.target.value) })
              }
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowEnrollmentModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEnrollment}
                  className="px-4 py-2 rounded-md bg-black text-white hover:border-3 border-neutral-400 transition-all"
                >
                  Add Department
                </button>
              </div>
        </motion.div>
      )}
    </div>
  );
}

export default StudentDetail;
