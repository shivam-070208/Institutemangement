import { useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { IconPlus, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface Department {
  id: number;
  name: string;
  head: string;
  faculty: number;
  students: number;
}

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: "Computer Science",
      head: "Dr. Sarah Williams",
      faculty: 45,
      students: 850,
    },
    {
      id: 2,
      name: "Mathematics",
      head: "Dr. Michael Chen",
      faculty: 32,
      students: 620,
    },
    {
      id: 3,
      name: "Physics",
      head: "Dr. Emily Brown",
      faculty: 28,
      students: 480,
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", head: "", contact: "" });

  const columns = [
    { key: "name", label: "Department" },
    { key: "head", label: "Department Head" },
    { key: "faculty", label: "Faculty Members" },
    { key: "students", label: "Students" },
  ];

  const handleAdd = () => {
    if (!newDept.name || !newDept.head || !newDept.contact)
      return  toast("Fill all details⚠️");
    const newDepartment = {
      id: departments.length + 1,
      name: newDept.name,
      head: newDept.head,
      faculty: 0,
      students: 0,
    };
    setDepartments([...departments, newDepartment]);
    setShowModal(false);
    setNewDept({ name: "", head: "", contact: "" });
    toast("New DepartMent Added🎉")
  };

  return (
    <div className="space-y-6 relative px-2 w-[100%] flex flex-col  flex-wrap">
      <div className="flex w-full justify-between flex-wrap flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">
            Manage departments and their structure
          </p>
        </div>
        <div
          onClick={() => setShowModal(true)}
          className="flex bg-white border-neutral-200 border cursor-pointer items-center font-semibold h-fit px-4 py-2 rounded-sm shadow-input"
        >
          <IconPlus size={15} /> Add
        </div>
      </div>
      <div className="max-w-full ">
        <DataTable
          data={departments}
          columns={columns}
          searchPlaceholder="Search departments..."
        />
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            {/* Frosted glass blur background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 -top-9 backdrop-blur-md z-40"
              onClick={() => setShowModal(false)}
            />

            {/* Centered popup form */}
            <motion.div
              layoutId="add-department-popup"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="fixed top-10 right-4 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 w-[90%] max-w-md shadow-lg z-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Department</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-black"
                >
                  <IconX size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Department Name"
                  value={newDept.name}
                  onChange={(e) =>
                    setNewDept({ ...newDept, name: e.target.value })
                  }
                  
                />
                <Input
                  type="text"
                  placeholder="Head of Department"
                  value={newDept.head}
                  onChange={(e) =>
                    setNewDept({ ...newDept, head: e.target.value })
                  }
                />
                <Input
                  type="email"
                  placeholder="Contact Email"
                  value={newDept.contact}
                  onChange={(e) =>
                    setNewDept({ ...newDept, contact: e.target.value })
                  }
                />
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
                  Add Department
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Departments;
