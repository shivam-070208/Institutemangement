import { useState, useEffect } from "react";
import { DataTable } from "@/components/common/DataTable";
import { IconPlus, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface Department {
  id:Number;
  department_id: number;
  name: string;
  head_of_department: string;
  Contact_Mail:string;
}

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newDept, setNewDept] = useState({ Name: "", HOD: "", Contact_Mail: "" });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const columns = [
    { key: "name", label: "Department" },
    { key: "head_of_department", label: "Department Head" },
    {key:"contact_email",label:"Head Email"}
  ];
  
  const fetchDepartments = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/institute/fetchDepartMent?page=${page}&limit=5`,{
        credentials:'include'
      });
      const data = await res.json();
      let department = [];
     
         department = data.departments?.map((item)=>{
          item.id = item.department_id;
          return item;
        })
      
      if (page === 1) {
        setDepartments(department??[]);
      } else {
        setDepartments((prev) => [...prev, ...department]);
      }

      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments(page);
  }, [page]);

  const handleAdd = async () => {

   
    if (!newDept.Name || !newDept.HOD || !newDept.Contact_Mail) {
      return toast("Fill all details⚠️");
    }
  
    // Prepare the new department object
    const newDepartment = {
      Name: newDept.Name,
      HOD: newDept.HOD,
      Contact_Mail: newDept.Contact_Mail,
      faculty: 0,
      students: 0,
    };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/institute/addDepartment`, {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDepartment),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return toast(data.message || "Failed to add department⚠️");
      }
      let department = data?.department;
      department.id = department?.department_id;

     setDepartments((prev)=>[...prev,department])
      setShowModal(false);
      setNewDept({ Name: "", HOD: "", Contact_Mail: "" });
        toast("New Department Added🎉");
    } catch (error) {
      toast("An error occurred. Please try again⚠️");
    }
  };
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const bottom =
      e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (bottom && !loading && page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6 relative px-2 w-[100%] flex flex-col flex-wrap">
      <div className="flex w-full justify-between flex-wrap flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">Manage departments and their structure</p>
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
          data={departments as any}
          columns={columns}
          searchPlaceholder="Search departments..."
        />
      </div>

      <div
        onScroll={handleScroll}
        className="overflow-auto max-h-[400px] space-y-4 border border-neutral-300 rounded-md p-4"
      >
        {departments.length === 0 && !loading ? (
          <p>No departments found.</p>
        ) : null}

        {loading && <p>Loading more departments...</p>}
      </div>

      {!loading && page < totalPages && (
        <div className="flex justify-center">
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-md bg-black text-white hover:border-3 border-neutral-400 transition-all"
          >
            Load More
          </button>
        </div>
      )}

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
                  value={newDept.Name}
                  onChange={(e) =>
                    setNewDept({ ...newDept, Name: e.target.value })
                  }
                />
                <Input
                  type="text"
                  placeholder="Head of Department"
                  value={newDept.HOD}
                  onChange={(e) =>
                    setNewDept({ ...newDept, HOD: e.target.value })
                  }
                />
                <Input
                  type="email"
                  placeholder="Contact Email"
                  value={newDept.Contact_Mail}
                  onChange={(e) =>
                    setNewDept({ ...newDept, Contact_Mail: e.target.value })
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
