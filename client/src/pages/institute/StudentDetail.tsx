import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";

function shimmer() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-8 bg-gray-200 rounded w-2/3" />
      <div className="h-6 bg-gray-100 rounded w-1/3" />
      <div className="h-6 bg-gray-100 rounded w-1/2" />
      <div className="h-6 bg-gray-100 rounded w-1/4" />
    </div>
  );
}

function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [newEnrollment, setNewEnrollment] = useState({
    department_id: "",
    enrollment_no: "",
    semester: 1,
    fees_paid: 0,
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await fetchStudentDetail(id);
      await fetchStudentEnrollments(id);
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const fetchStudentDetail = async (studentId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/institute/student/${studentId}/details`,
        { credentials: "include" }
      );
      const data = await res.json();
      setStudent(data.student);
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast("Could not fetch student details ⚠️");
    }
  };

  const fetchStudentEnrollments = async (studentId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/institute/student/${studentId}/details`,
        { credentials: "include" }
      );
      const data = await res.json();
      setEnrollments(data.enrollmentHistory || []);
    } catch (error) {
      console.error("Error fetching student enrollments:", error);
      toast("Could not fetch enrollments ⚠️");
    }
  };

  const handleAddEnrollment = async () => {
    if (!newEnrollment.enrollment_no || !newEnrollment.semester) {
      return toast("Please fill all the required fields ⚠️");
    }
    newEnrollment.department_id = student.department_id;

    try {
      const body = { ...newEnrollment, student_id: id };
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/institute/enrollment`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) return toast(data.message || "Failed to add enrollment ⚠️");

      setEnrollments((prev) => [...prev, data.enrollment]);
      setShowEnrollmentModal(false);
      setNewEnrollment({
        department_id: "",
        enrollment_no: "",
        semester: 1,
        fees_paid: 0,
      });
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
    <div className="w-full min-h-[100vh] bg-gradient-to-br from-[#f2f4fa] via-white to-[#e7ebf7] flex justify-center items-start p-0 md:px-8 py-10">
      <AnimatePresence>
        <div className="w-full mx-auto space-y-8 transition-all">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                Student Profile
              </h1>
              <p className="text-gray-500 mt-2 text-lg font-medium tracking-wide">
                View and manage complete details of the student
              </p>
            </div>
            <Button
              variant="outline"
              className="bg-gradient-to-tr from-black via-gray-900 to-neutral-800 text-white border-none shadow-lg px-7 py-3 flex items-center gap-2 rounded-lg hover:scale-105 duration-200"
              onClick={() => setShowEnrollmentModal(true)}
              aria-label="Add Enrollment"
            >
              <IconPlus size={19} /> Add Enrollment
            </Button>
          </div>

          {/* Student Info Card */}
          <div className="bg-white/95 border border-neutral-200 shadow-lg rounded-3xl px-8 py-8 flex flex-col md:flex-row gap-8 transition-all relative overflow-hidden backdrop-blur-sm">
            {loading || !student ? (
              shimmer()
            ) : (
              <>
                {/* Profile Image or Initials */}
                <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-tr from-black to-gray-700 text-white font-bold text-3xl rounded-full flex items-center justify-center shadow-sm border-4 border-white/70 select-none uppercase">
                  {student.name
                    ? student.name
                        .split(" ")
                        .map((s: string) => s[0])
                        .join("")
                        .substring(0, 2)
                    : ""}
                </div>
                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">{student.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-[1rem] text-gray-700">
                    <div>
                      <span className="font-medium text-gray-500">Email</span>
                      <div>{student.email}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Phone</span>
                      <div>{student.phone || <span className="text-gray-400">-</span>}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Department</span>
                      <div>{student.department_id}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Semester</span>
                      <div>{student.semester}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Section</span>
                      <div>{student.section || <span className="text-gray-400">-</span>}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Status</span>
                      <div>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            student.active
                              ? "bg-emerald-100 text-emerald-600 border border-emerald-300"
                              : "bg-red-100 text-red-500 border border-red-200"
                          }`}
                        >
                          {student.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Enrollment History */}
          <div className="rounded-3xl shadow-lg bg-white/95 border border-neutral-200 px-6 py-7 mt-2 transition-all">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                Enrollment History
              </h2>
              <Button
                size="sm"
                variant="ghost"
                className="flex gap-2 px-3 py-2 rounded-md bg-neutral-50 hover:bg-neutral-100"
                onClick={() => setShowEnrollmentModal(true)}
              >
                <IconPlus size={16} />
                Add
              </Button>
            </div>
            <DataTable
              data={enrollments}
              columns={enrollmentColumns}
              searchPlaceholder="Search enrollments..."
            />
            {(!enrollments || enrollments.length === 0) && (
              <div className="py-4 text-center text-gray-400 text-md">
                No enrollment records found.
              </div>
            )}
          </div>
        </div>
      </AnimatePresence>

      {/* Modal Overlay in old position, do NOT center on page but keep as previous! */}
      <AnimatePresence>
        {showEnrollmentModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowEnrollmentModal(false)}
            />
            {/* Modal */}
            <motion.div
              layoutId="add-enrollment-popup"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.18, type: "spring", bounce: 0.22 }}
              className="fixed -top-2 max-h-[90vh] overflow-y-auto right-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 w-[90%] max-w-md shadow-lg z-50"
              // position is the same as original! DO NOT center vertically!
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Enrollment</h2>
              </div>

              <form
                autoComplete="off"
                onSubmit={e => {
                  e.preventDefault();
                  handleAddEnrollment();
                }}
                className="space-y-4"
              >
                <div>
                  <Label>Enrollment No <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    placeholder="Enter Enrollment No"
                    value={newEnrollment.enrollment_no}
                    onChange={e =>
                      setNewEnrollment({ ...newEnrollment, enrollment_no: e.target.value })
                    }
                    autoFocus
                  />
                </div>
                <div>
                  <Label>Semester <span className="text-red-500">*</span></Label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    placeholder="Enter Semester"
                    value={newEnrollment.semester}
                    onChange={e =>
                      setNewEnrollment({ ...newEnrollment, semester: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Fees Paid</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Enter Fees Paid"
                    value={newEnrollment.fees_paid}
                    onChange={e =>
                      setNewEnrollment({ ...newEnrollment, fees_paid: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEnrollmentModal(false)}
                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-black text-white hover:border-3 border-neutral-400 transition-all"
                  >
                    Add Enrollment
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StudentDetail;
