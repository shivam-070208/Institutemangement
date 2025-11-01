import { useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: number;
  code: string;
  name: string;
  department: string;
  credits: number;
  semester: string;
}

const Courses = () => {
  const [courses] = useState<Course[]>([
    { id: 1, code: "CS101", name: "Introduction to Programming", department: "Computer Science", credits: 4, semester: "Fall 2024" },
    { id: 2, code: "MATH201", name: "Calculus II", department: "Mathematics", credits: 3, semester: "Fall 2024" },
    { id: 3, code: "PHY101", name: "Physics Fundamentals", department: "Physics", credits: 4, semester: "Fall 2024" },
  ]);

  const columns = [
    { key: "code", label: "Code" },
    { key: "name", label: "Course Name" },
    { key: "department", label: "Department" },
    { key: "credits", label: "Credits" },
    { key: "semester", label: "Semester" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-muted-foreground">Manage courses and curriculum</p>
      </div>

      <DataTable
        data={courses}
        columns={columns}
        searchPlaceholder="Search courses..."
      />
    </div>
  );
};

export default Courses;
