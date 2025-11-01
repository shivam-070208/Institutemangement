import { useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
  year: string;
  status: "active" | "inactive";
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "John Doe", email: "john@example.com", department: "Computer Science", year: "2nd Year", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", department: "Mathematics", year: "3rd Year", status: "active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", department: "Physics", year: "1st Year", status: "active" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "year", label: "Year" },
    {
      key: "status",
      label: "Status",
      render: (student: Student) => (
        <Badge variant={student.status === "active" ? "default" : "secondary"}>
          {student.status}
        </Badge>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    setStudents(students.filter((s) => s.id !== student.id));
    toast.success("Student deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStudent: Student = {
      id: editingStudent?.id || Date.now(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      department: formData.get("department") as string,
      year: formData.get("year") as string,
      status: (formData.get("status") as "active" | "inactive") || "active",
    };

    if (editingStudent) {
      setStudents(students.map((s) => (s.id === editingStudent.id ? newStudent : s)));
      toast.success("Student updated successfully");
    } else {
      setStudents([...students, newStudent]);
      toast.success("Student added successfully");
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground">Manage student records and information</p>
      </div>

      <DataTable
        data={students}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search students..."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingStudent?.name}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={editingStudent?.email}
                required
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                defaultValue={editingStudent?.department}
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Select name="year" defaultValue={editingStudent?.year}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={editingStudent?.status || "active"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
