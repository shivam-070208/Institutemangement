import { useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";

interface Faculty {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  status: "active" | "on-leave";
}

const Faculty = () => {
  const [faculty] = useState<Faculty[]>([
    { id: 1, name: "Dr. Sarah Williams", email: "sarah@university.edu", department: "Computer Science", position: "Professor", status: "active" },
    { id: 2, name: "Dr. Michael Chen", email: "michael@university.edu", department: "Mathematics", position: "Associate Professor", status: "active" },
    { id: 3, name: "Dr. Emily Brown", email: "emily@university.edu", department: "Physics", position: "Assistant Professor", status: "on-leave" },
  ]);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "position", label: "Position" },
    {
      key: "status",
      label: "Status",
      render: (faculty: Faculty) => (
        <Badge variant={faculty.status === "active" ? "default" : "secondary"}>
          {faculty.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Faculty</h1>
        <p className="text-muted-foreground">Manage faculty members and their information</p>
      </div>

      <DataTable
        data={faculty}
        columns={columns}
        searchPlaceholder="Search faculty..."
      />
    </div>
  );
};

export default Faculty;
