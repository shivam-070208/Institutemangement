import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DataTable } from "@/components/common/DataTable";
import { useStudentAuth } from "@/components/context/StudentAuthProvider";
import {
  IconUser,
  IconBook2,
  IconSchool,
  IconCheck,
} from "@tabler/icons-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const CARD_ICONS = [
  <IconUser size={26} key="profile" className="text-violet-600" />,
  <IconSchool size={26} key="dept" className="text-emerald-600" />,
  <IconBook2 size={26} key="semesters" className="text-amber-500" />,
  <IconCheck size={26} key="fees" className="text-rose-500" />,
];
const BAR_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

function StudentDashboard() {
  const { student, enrollmentHistory } = useStudentAuth();
  const [stats, setStats] = useState({
    department: "",
    totalSemesters: 0,
    semestersPassed: 0,
    feesPaid: 0,
    totalFees: 0,
    currentSemester: null as number | null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (student && enrollmentHistory) {
      const totalSemesters = enrollmentHistory.length;
      const semestersPassed = enrollmentHistory.map((e) => e.status === "Passed" ? 1 : 0).reduce((a: number, b: number) => a + b, 0);
      const feesPaid = enrollmentHistory.map((e: { fees_paid?: number }) => e.fees_paid ?? 0).reduce((sum: number, v: number) => sum + v, 0);
      const totalFees = enrollmentHistory.map((e: { fees_due?: number }) => e.fees_due ?? 0).reduce((sum: number, v: number) => sum + v, 0);
      const currentSemester =
        enrollmentHistory.length > 0
          ? Math.max(...enrollmentHistory.map((e) => e.semester))
          : null;

      setStats({
        department: student.department_id || "",
        totalSemesters,
        semestersPassed,
        feesPaid,
        totalFees,
        currentSemester,
      });
    }
    setTimeout(() => setIsLoaded(true), 180); // for entrance animation
  }, [student, enrollmentHistory]);

  const columns = [
    { key: "enrollment_no", label: "Enrollment No" },
    { key: "status", label: "Status" },
    { key: "semester", label: "Semester" },
    { key: "fees_paid", label: "Fees Paid" },
  ];

  // Bar chart data: (dummy view: update if needed)
  const barData = [
    { name: "Total Semesters", value: stats.totalSemesters },
    { name: "Semesters Passed", value: stats.semestersPassed },
    { name: "Fees Paid", value: stats.feesPaid },
    { name: "Fees Due", value: Math.max(stats.totalFees - stats.feesPaid, 0) },
  ];

  return (
    <div className="space-y-8 p-4 w-full">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      <p className="text-muted-foreground">Your academic profile & progress</p>

      {student && (
        <>
          {/* Animated Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                title: "Profile",
                value: student.name,
                icon: CARD_ICONS[0],
              },
              {
                title: "Department",
                value: stats.department,
                icon: CARD_ICONS[1],
              },
              {
                title: "Current Semester",
                value: stats.currentSemester ?? "Not enrolled",
                icon: CARD_ICONS[2],
              },
              {
                title: "Fees Paid",
                value: `₹${stats.feesPaid}`,
                icon: CARD_ICONS[3],
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={
                  isLoaded
                    ? { opacity: 1, y: 0 }
                    : {}
                }
                transition={{ delay: 0.10 * idx }}
                className="bg-white rounded-xl shadow-sm border p-5 flex flex-col items-start gap-2"
              >
                <div className="mb-1">{card.icon}</div>
                <span className="text-sm text-muted-foreground">{card.title}</span>
                <span className="text-xl font-bold">{card.value}</span>
              </motion.div>
            ))}
          </div>

          {/* Chart + Profile below */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
            {/* Academic Progress Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.10 }}
              className="bg-white p-6 rounded-xl shadow-sm border h-[290px]"
            >
              <h2 className="text-xl font-semibold mb-4">Academic Summary</h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, index) => (
                 
                      <Cell
                        key={`cell-${index}`}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.16 }}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >
              <h2 className="text-2xl font-bold mb-2">Profile</h2>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {student.name}
                </p>
                <p>
                  <strong>Email:</strong> {student.email}
                </p>
                <p>
                  <strong>Phone:</strong> {student.phone}
                </p>
                <p>
                  <strong>Department:</strong> {student.department_id}
                </p>
                <p>
                  <strong>Current Semester:</strong> {stats.currentSemester ?? "Not enrolled"}
                </p>
                <p>
                  <strong>Section:</strong> {student.section}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Enrollment Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.19 }}
            className="bg-white p-6 rounded-xl shadow-sm border mt-2"
          >
            <h2 className="text-xl font-semibold mb-4">Enrollment History</h2>
            <DataTable
              data={enrollmentHistory}
              columns={columns}
              searchPlaceholder="Search enrollments..."
            />
          </motion.div>
        </>
      )}
    </div>
  );
}

export default StudentDashboard;
