import { useState } from "react";
import { DataTable } from "@/components/common/DataTable";

interface Department {
  id: number;
  name: string;
  head: string;
  faculty: number;
  students: number;
}

const Departments = () => {
  const [departments] = useState<Department[]>([
    { id: 1, name: "Computer Science", head: "Dr. Sarah Williams", faculty: 45, students: 850 },
    { id: 2, name: "Mathematics", head: "Dr. Michael Chen", faculty: 32, students: 620 },
    { id: 3, name: "Physics", head: "Dr. Emily Brown", faculty: 28, students: 480 },
  ]);

  const columns = [
    { key: "name", label: "Department" },
    { key: "head", label: "Department Head" },
    { key: "faculty", label: "Faculty Members" },
    { key: "students", label: "Students" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Departments</h1>
        <p className="text-muted-foreground">Manage departments and their structure</p>
      </div>

      <DataTable
        data={departments}
        columns={columns}
        searchPlaceholder="Search departments..."
      />
    </div>
  );
};

export default Departments;
