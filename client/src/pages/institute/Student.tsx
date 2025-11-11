import { useState, useEffect } from "react";
import { DataTable } from "@/components/common/DataTable";
import { IconPlus, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LabelInputContainer } from "./Create";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ConfirmPopup } from "@/components/ui/confirm-popup";

interface Department {
  id: number;
  label: string;
}

interface Student {
  student_id: number;
  name: string;
  email: string;
  phone: string;
  semester: number;
  section: string;
  department: string;
}

const inputFields = [
  {
    key: "name",
    label: "Student Name",
    type: "text",
    placeholder: "Enter student name",
  },
  { key: "email", label: "Email", type: "email", placeholder: "Enter email" },
  {
    key: "phone",
    label: "Phone",
    type: "text",
    placeholder: "Enter phone number",
  },
  {
    key: "semester",
    label: "Semester",
    type: "number",
    placeholder: "Enter semester",
  },
  {
    key: "section",
    label: "Section",
    type: "text",
    placeholder: "Enter section (A/B/C)",
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },
];

function Student() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newStudent, setNewStudent] = useState<any>({
    name: "",
    email: "",
    phone: "",
    semester: 1,
    section: "",
    department_id: "",
    password: "",
  });

  // State for popup confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Student | null>(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/institute/fetchStudent?page=1&limit=50`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setStudents(data.students || []);
    } catch {
      toast("Failed to load students ⚠️");
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/institute/fetchDepartMent`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setDepartments(
        data.departments.map((d: any) => ({
          id: d.department_id,
          label: d.name,
        }))
      );
    } catch {
      toast("Failed to load departments ⚠️");
    }
  };

  const onClick = (item: any) => {
    navigate(`./${item.student_id}`);
  };

  // Show confirmation on delete rather than alert
  const handleDelete = (item: Student) => {
    setPendingDelete(item);
    setConfirmOpen(true);
  };

  // Handles the confirmation popup acceptance
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/institute/student/${pendingDelete.student_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast(data?.message || "Failed to delete student ⚠️");
        setConfirmOpen(false);
        setPendingDelete(null);
        return;
      }
      toast("Student removed successfully 🗑️");
      setConfirmOpen(false);
      setPendingDelete(null);
      fetchStudents();
    } catch {
      toast("Server Error ⚠️");
      setConfirmOpen(false);
      setPendingDelete(null);
    }
  };

  // Handles cancellation of confirmation
  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDelete(null);
  };

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, []);

  const handleAdd = async () => {
    if (Object.values(newStudent).some((v) => v === "")) {
      return toast("Please fill all fields ⚠️");
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/institute/addStudent`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStudent),
        }
      );

      const data = await res.json();
      if (!res.ok) return toast(data.message);

      setShowModal(false);
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        semester: 1,
        section: "",
        department_id: "",
        password: "",
      });
      fetchStudents();
      toast("Student Added 🎉");
    } catch {
      toast("Server Error ⚠️");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "department", label: "Department" },
    { key: "semester", label: "Semester" },
    { key: "section", label: "Section" },
  ];

  return (
    <div className="space-y-6 relative px-2 w-full flex flex-col">
      <div className="flex w-full justify-between flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage enrolled students</p>
        </div>
        <div
          onClick={() => setShowModal(true)}
          className="flex bg-white border-neutral-200 border cursor-pointer items-center font-semibold h-fit px-4 py-2 rounded-sm shadow-input"
        >
          <IconPlus size={15} /> Add
        </div>
      </div>

      <DataTable
        onClick={onClick}
        onDelete={handleDelete}
        data={students as any}
        columns={columns}
        searchPlaceholder="Search students..."
      />

        <ConfirmPopup
        open={confirmOpen}
        title="Delete Student"
        message={
          pendingDelete
            ? `Are you sure you want to permanently delete "${pendingDelete.name}"? This action cannot be undone.`
            : ""
        }
        onConfirm={confirmDelete}
        onClose={cancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 -top-4 z-40"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              exit={{ opacity: 0 }}
              className="fixed top-10 right-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border rounded-2xl p-6 w-[90%] max-w-md shadow-lg z-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Student</h2>
                <IconX
                  size={20}
                  className="cursor-pointer"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="space-y-3">
                {inputFields.map((field) => (
                  <LabelInputContainer key={field.key}>
                    <Label>{field.label}</Label>
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={newStudent[field.key]}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          [field.key]:
                            field.type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                        })
                      }
                    />
                  </LabelInputContainer>
                ))}

                <LabelInputContainer>
                  <Label>Department</Label>
                  <Select
                    id="department"
                    name="department_id"
                    value={newStudent.department_id}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        department_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </Select>
                </LabelInputContainer>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 rounded-md bg-black text-white hover:border-3 border-neutral-400 transition-all"
                >
                  Add Student
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Student;


