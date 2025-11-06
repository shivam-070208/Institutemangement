import { useState, useEffect } from "react";
import { DataTable } from "@/components/common/DataTable";
import { IconPlus, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multiselect-input";
import { LabelInputContainer } from "./Create";
import { Label } from "@/components/ui/label";

interface Department {
  id: number;
  label: string;
}

interface Course {
  id: number;
  course_id: number;
  name: string;
  code: string;
  description: string;
  credit_hours: number;
  semester: number;
  departments: Department[];
}

const inputFields = [
  { key: "name", label: "Course Name", type: "text", placeholder: "Enter course name" },
  { key: "code", label: "Course Code", type: "text", placeholder: "Enter course code" },
  { key: "description", label: "Description", type: "text", placeholder: "Enter description" },
  { key: "credit_hours", label: "Credit Hours", type: "number", placeholder: "Enter credit hours" },
  { key: "semester", label: "Semester", type: "number", placeholder: "Enter semester" },
];

function Course() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<(number | string)[]>([]);
  const [newCourse, setNewCourse] = useState<any>({
    name: "",
    code: "",
    description: "",
    credit_hours: 0,
    semester: 1,
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const columns = [
    { key: "name", label: "Course Name" },
    { key: "code", label: "Code" },
    { key: "description", label: "Description" },
    { key: "credit_hours", label: "Credits" },
    { key: "semester", label: "Semester" },
  ];

  useEffect(() => {
    fetchCourses(page);
    fetchDepartments();
  }, [page]);

  const fetchCourses = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/institute/fetchCourse?page=${page}&limit=5`,
        { credentials: "include" }
      );
      const data = await res.json();
      
      const mappedCourses =
        data.courses?.map((item: any) => ({
          ...item,
          id: item.course_id,
          departments: item.departments || [],
        })) || [];

      if (page === 1) setCourses(mappedCourses);
      else setCourses((prev) => [...prev, ...mappedCourses]);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/institute/fetchDepartMent`, {
        credentials: "include",
      });
      const data = await res.json();
      const deptOptions = data.departments?.map((d: any) => ({
        id: d.department_id,
        label: d.name,
      }));
      setDepartments(deptOptions || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleAdd = async () => {
    console.log(newCourse);
    
    if (
      Object.values(newCourse).some((val) => val === "" || val === 0) ||
      selectedDepartments.length === 0
    ) {
      return toast("Please fill all fields ⚠️");
    }

    const courseData = { ...newCourse, departments: selectedDepartments };

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/institute/addCourse`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      const data = await res.json();
      if (!res.ok) return toast(data.message || "Failed to add course ⚠️");

      setCourses((prev) => [data.course, ...prev]);
      setShowModal(false);
      setNewCourse({ name: "", code: "", description: "", credit_hours: 0, semester: 1, password: "" });
      setSelectedDepartments([]);
      toast("New Course Added 🎉");
    } catch {
      toast("An error occurred. Please try again ⚠️");
    }
  };

  return (
    <div className="space-y-6 relative px-2 w-full flex flex-col">
      <div className="flex w-full justify-between flex-wrap flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage courses and assign departments</p>
        </div>
        <div
          onClick={() => setShowModal(true)}
          className="flex bg-white border-neutral-200 border cursor-pointer items-center font-semibold h-fit px-4 py-2 rounded-sm shadow-input"
        >
          <IconPlus size={15} /> Add
        </div>
      </div>

      <DataTable data={courses} columns={columns} searchPlaceholder="Search courses..." />

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 -top-4 backdrop-blur-md z-40"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              layoutId="add-course-popup"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="fixed top-1 h-[90dvh] overflow-y-scroll right-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 w-[90%] max-w-md shadow-lg z-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Course</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
                  <IconX size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {inputFields.map((field) => (
                  <LabelInputContainer key={field.key}>
                    <Label>{field.label}</Label>
                    <Input
                      type={field.type as any}
                      placeholder={field.placeholder}
                      value={newCourse[field.key]}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value })
                      }
                    />
                  </LabelInputContainer>
                ))}

                <div>
                  <label className="block mb-1 font-semibold">Departments</label>
                  <MultiSelect
                    data={departments}
                    value={selectedDepartments}
                    onChange={(selected: (number | string)[]) => setSelectedDepartments(selected)}
                  />
                </div>
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
                  Add Course
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Course;
