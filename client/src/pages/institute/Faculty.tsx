import { useState, useEffect } from "react";
import { DataTable } from "@/components/common/DataTable";
import { IconPlus, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { ConfirmPopup } from "@/components/ui/confirm-popup";

interface Faculty {
  id: number;
  faculty_id: number;
  name: string;
  subjects: string[];
  contact_email: string;
}

function Faculty() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newFaculty, setNewFaculty] = useState({ 
    name: "", 
    subjects: "", 
    contact_email: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // For delete confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Faculty | null>(null);

  const columns = [
    { key: "name", label: "Faculty Name" },
    { key: "subjects", label: "Subjects" },
    { key: "contact_email", label: "Email" },
  ];

  const fetchFaculty = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/institute/fetchFaculty?page=${page}&limit=5`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();

      const faculty =
        data.faculty?.map((item: any) => ({
          ...item,
          id: item.faculty_id,
          subjects: item.subjects?.join(", ") || "",
        })) || [];

      if (page === 1) setFacultyList(faculty);
      else setFacultyList((prev) => [...prev, ...faculty]);

      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty(page);
    // eslint-disable-next-line
  }, [page]);

  const handleAdd = async () => {
    if (
      !newFaculty.name ||
      !newFaculty.subjects ||
      !newFaculty.contact_email ||
      !newFaculty.password
    ) {
      return toast("Please fill all details ⚠️");
    }

    const newFacultyData = {
      name: newFaculty.name,
      subjects: newFaculty.subjects.split(",").map((s) => s.trim()),
      contact_email: newFaculty.contact_email,
      password: newFaculty.password,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/institute/addFaculty`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newFacultyData),
        }
      );

      const data = await response.json();
      if (!response.ok)
        return toast(data.message || "Failed to add faculty ⚠️");

      const faculty = {
        ...data.faculty,
        id: data.faculty?.faculty_id,
        subjects: data.faculty?.subjects?.join(", ") || "",
      };
      setFacultyList((prev) => [faculty, ...prev]);
      setShowModal(false);
      setNewFaculty({
        name: "",
        subjects: "",
        contact_email: "",
        password: "",
      });
      toast("New Faculty Added 🎉");
    } catch {
      toast("An error occurred. Please try again ⚠️");
    }
  };

  // Delete logic
  const handleDelete = (faculty: Faculty) => {
    setPendingDelete(faculty);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/institute/faculty/${pendingDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) {
        const data = await res.json();
        toast(data.message || "Failed to delete faculty ⚠️");
      } else {
        setFacultyList((prev) =>
          prev.filter((fac) => fac.id !== pendingDelete.id)
        );
        toast("Faculty Deleted 🗑️");
      }
    } catch {
      toast("Server Error ⚠️");
    }
    setConfirmOpen(false);
    setPendingDelete(null);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDelete(null);
  };

  // Optionally, DataTable could take onClick for row click and onDelete
  return (
    <div className="space-y-6 relative px-2 w-full flex flex-col flex-wrap">
      <div className="flex w-full justify-between flex-wrap flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">Faculty</h1>
          <p className="text-muted-foreground">
            Manage faculty members and their subjects
          </p>
        </div>
        <div
          onClick={() => setShowModal(true)}
          className="flex bg-white border-neutral-200 border cursor-pointer items-center font-semibold h-fit px-4 py-2 rounded-sm shadow-input"
        >
          <IconPlus size={15} /> Add
        </div>
      </div>

      <div className="max-w-full">
        <DataTable
          data={facultyList as any}
          columns={columns}
          searchPlaceholder="Search faculty..."
          onDelete={handleDelete}
        />
      </div>

      <ConfirmPopup
        open={confirmOpen}
        title="Delete Faculty"
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
              className="fixed inset-0 -top-9 backdrop-blur-md z-40"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              layoutId="add-faculty-popup"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="fixed top-10 right-4 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 w-[90%] max-w-md shadow-lg z-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Faculty</h2>
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
                  placeholder="Faculty Name"
                  value={newFaculty.name}
                  onChange={(e) =>
                    setNewFaculty({ ...newFaculty, name: e.target.value })
                  }
                />
                <Input
                  type="text"
                  placeholder="Subjects (comma separated)"
                  value={newFaculty.subjects}
                  onChange={(e) =>
                    setNewFaculty({ ...newFaculty, subjects: e.target.value })
                  }
                />
                <Input
                  type="email"
                  placeholder="Contact Email"
                  value={newFaculty.contact_email}
                  onChange={(e) =>
                    setNewFaculty({
                      ...newFaculty,
                      contact_email: e.target.value,
                    })
                  }
                />
                <Input
                  type="password"
                  placeholder="Set Password"
                  value={newFaculty.password}
                  onChange={(e) =>
                    setNewFaculty({ ...newFaculty, password: e.target.value })
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
                  Add Faculty
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Faculty;
