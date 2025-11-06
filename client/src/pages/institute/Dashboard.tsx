import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DataTable } from "@/components/common/DataTable";
import {
  PieChart, Pie, Cell,LineChart,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Line
} from "recharts";


function Dashboard() {
  const [stats, setStats] = useState({
    departments: 0,
    faculty: 0,
    courses: 0,
    students: 0,
  });

  const [recent, setRecent] = useState<any[]>([]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/institute/dashboardSummary`, {
        credentials: "include",
      });
      const data = await res.json();

      setStats(data);

      // ✅ Ensure each row has `id`
      const mapped = (data.recentStudents || []).map((item: any) => ({
        ...item,
        id: item.student_id,
      }));
      setRecent(mapped);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = [
    { title: "Departments", value: stats.departments },
    { title: "Faculty", value: stats.faculty },
    { title: "Courses", value: stats.courses },
    { title: "Students", value: stats.students },
  ];

  const columns = [
    { key: "name", label: "Student Name" },
    { key: "department", label: "Dept" },
    { key: "semester", label: "Sem" },
    { key: "section", label: "Section" },
  ];

  const pieData = [
    { name: "Departments", value: stats.departments },
    { name: "Faculty", value: stats.faculty },
    { name: "Courses", value: stats.courses },
    { name: "Students", value: stats.students },
  ];

  const semesterData = recent.reduce((acc: any[], cur) => {
    const existing = acc.find((x) => x.semester === cur.semester);
    if (existing) existing.count++;
    else acc.push({ semester: cur.semester, count: 1 });
    return acc;
  }, []);

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="space-y-8 p-4 w-full">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Overview of your institution</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <p className="text-sm text-gray-500">{card.title}</p>
            <h2 className="text-3xl font-semibold">{card.value}</h2>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Overall Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Students per Semester</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={semesterData}>
              <XAxis dataKey="semester" />
              <YAxis />
              <Tooltip />
              <Line dataKey="count" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Recent Table */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Recently Added Students</h2>
        <DataTable data={recent} columns={columns} searchPlaceholder="Search students..." />
      </div>
    </div>
  );
}

export default Dashboard;
