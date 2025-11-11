import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DataTable } from "@/components/common/DataTable";
import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  IconHome2,
  IconUsers,
  IconBook2,
  IconUserCheck,
} from "@tabler/icons-react";

const CARD_ICONS = [
  <IconHome2 size={26} key="departments" className="text-violet-600" />,
  <IconUsers size={26} key="faculty" className="text-emerald-600" />,
  <IconBook2 size={26} key="courses" className="text-amber-500" />,
  <IconUserCheck size={26} key="students" className="text-rose-500" />,
];
const BAR_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

function Dashboard() {
  const [stats, setStats] = useState({
    departments: 0,
    faculty: 0,
    courses: 0,
    students: 0,
  });
  const [recent, setRecent] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/institute/dashboardSummary`,
          { credentials: "include" }
        );
        const data = await res.json();
        setStats(data);
        const mapped = (data.recentStudents || []).map((item: any) => ({
          ...item,
          id: item.student_id,
        }));
        setRecent(mapped);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setTimeout(() => setIsLoaded(true), 180); // slight delay for entrance feel
      }
    };
    fetchDashboard();
  }, []);

  const barData = [
    { name: "Departments", value: stats.departments },
    { name: "Faculty", value: stats.faculty },
    { name: "Courses", value: stats.courses },
    { name: "Students", value: stats.students },
  ];

  const columns = [
    { key: "name", label: "Student Name" },
    { key: "department", label: "Dept" },
    { key: "semester", label: "Sem" },
    { key: "section", label: "Section" },
  ];

  const semesterData = recent.reduce((acc: any[], cur) => {
    let found = acc.find((x) => x.semester === cur.semester);
    if (found) found.count++;
    else acc.push({ semester: cur.semester, count: 1 });
    return acc;
  }, []);

  const cards = [
    {
      title: "Departments",
      value: stats.departments,
    },
    {
      title: "Faculty",
      value: stats.faculty,
    },
    {
      title: "Courses",
      value: stats.courses,
    },
    {
      title: "Students",
      value: stats.students,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={
        isLoaded
          ? { opacity: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: "anticipate" } }
          : {}
      }
      transition={{ type: "spring", stiffness: 40 }}
      className="flex flex-col gap-10 w-full px-4 pt-3 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={
          isLoaded
            ? { opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: 0.10, duration: 0.6 } }
            : {}
        }
        className="flex flex-col md:flex-row md:justify-between md:items-end gap-2 md:gap-0 pb-0 md:pb-2"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-1">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-neutral-500 font-medium">
            Institution insights at your fingertips
          </p>
        </div>
      </motion.div>

      {/* Stats Cards - Microinteractive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={
              isLoaded
                ? {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { delay: 0.13 + i * 0.11, duration: 0.48 },
                  }
                : {}
            }
            whileHover={{
              scale: 1.04,
              boxShadow:
                "0 2px 24px 0 rgba(80,80,255,.09), 0 1.5px 9px 0 rgba(0,0,0,0.03)",
              y: -4,
            }}
            whileTap={{ scale: 0.985, y: 0 }}
            className={`
              cursor-pointer bg-white p-5 rounded-2xl border border-neutral-200 shadow hover:shadow-lg 
              flex flex-row items-center gap-4 min-h-[106px] transition-all
              focus:outline-none focus:ring-2 focus:ring-primary
            `}
            tabIndex={0}
            aria-label={card.title}
          >
            <div className="flex-none rounded-xl bg-neutral-100 flex items-center justify-center w-12 h-12">
              {CARD_ICONS[i]}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-gray-500 tracking-wide">{card.title}</div>
              <div className="text-3xl font-bold text-gray-900">{card.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {/* Comparison Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={
            isLoaded
              ? {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { delay: 0.23, duration: 0.7 },
                }
              : {}
          }
          whileHover={{
            scale: 1.01,
            boxShadow: "0 2px 28px 0 rgba(95,120,255,.10), 0 1.5px 13px 0 rgba(0,0,0,0.03)",
          }}
          className="relative bg-white rounded-2xl border border-neutral-100 shadow-sm p-2 pb-5 flex flex-col"
        >
          <h3 className="px-6 pt-5 text-lg font-semibold text-neutral-800 mb-1">
            Overview Comparison
          </h3>
          {/* Responsive BarChart */}
          <div style={{ width: "100%", minHeight: 250, height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ left: 16, right: 16, top: 28, bottom: 10 }}>
                <XAxis
                  dataKey="name"
                  stroke="#888"
                  fontSize={13}
                  tickMargin={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#888"
                  fontSize={13}
                  width={32}
                  tickMargin={8}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 18px 0 #0002",
                    border: "none",
                    padding: "8px 15px"
                  }}
                  wrapperStyle={{ zIndex: 50 }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: 14, fontSize: 13, color: "#555" }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barData.map((_, index) => (
                    <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Line Chart for students per semester */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(7px)" }}
          animate={
            isLoaded
              ? {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { delay: 0.33, duration: 0.68 },
                }
              : {}
          }
          whileHover={{
            scale: 1.01,
            boxShadow: "0 2px 28px 0 rgba(80,255,145,.09), 0 1.5px 13px 0 rgba(0,0,0,0.03)",
          }}
          className="relative bg-white rounded-2xl border border-neutral-100 shadow-sm p-2 pb-5 flex flex-col"
        >
          <h3 className="px-6 pt-5 text-lg font-semibold text-neutral-800 mb-1">
            Students per Semester
          </h3>
          <div style={{ width: "100%", minHeight: 250, height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={semesterData} margin={{ left: 5, right: 25, top: 28, bottom: 10 }}>
                <XAxis dataKey="semester" stroke="#888" fontSize={13} tickMargin={8} />
                <YAxis stroke="#888" fontSize={13} width={28} tickMargin={8} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 18px 0 #0002",
                    border: "none",
                  }}
                  formatter={v => v}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 5, stroke: "#fff", strokeWidth: 2, fill: "#6366F1" }}
                  activeDot={{ r: 8 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={
          isLoaded
            ? {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { delay: 0.46, duration: 0.5 },
              }
            : {}
        }
        className="mt-10"
      >
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4">
          Recently Added Students
        </h2>
        <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-white/90 px-2 sm:px-4 py-4 transition-all">
          <DataTable
            data={recent}
            columns={columns}
            searchPlaceholder="Search students..."
          />
          {!recent.length && (
            <div className="text-neutral-400 text-center text-sm py-5">
              No recent students found.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
