import { MetricCard } from "@/components/common/MetricCard";
import { Users, GraduationCap, BookOpen, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const Dashboard = () => {
  const enrollmentData = [
    { month: "Jan", students: 400 },
    { month: "Feb", students: 450 },
    { month: "Mar", students: 520 },
    { month: "Apr", students: 580 },
    { month: "May", students: 620 },
    { month: "Jun", students: 680 },
  ];

  const gradeData = [
    { grade: "A", count: 120 },
    { grade: "B", count: 250 },
    { grade: "C", count: 180 },
    { grade: "D", count: 90 },
    { grade: "F", count: 30 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Students"
          value="2,845"
          icon={Users}
          trend={{ value: "12% from last month", isPositive: true }}
          iconBg="bg-primary"
        />
        <MetricCard
          title="Active Courses"
          value="142"
          icon={BookOpen}
          trend={{ value: "8% from last month", isPositive: true }}
          iconBg="bg-success"
        />
        <MetricCard
          title="Faculty Members"
          value="186"
          icon={GraduationCap}
          trend={{ value: "3% from last month", isPositive: true }}
          iconBg="bg-[hsl(200,70%,50%)]"
        />
        <MetricCard
          title="Departments"
          value="24"
          icon={Building2}
          trend={{ value: "2 new this month", isPositive: true }}
          iconBg="bg-[hsl(280,70%,55%)]"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 gap-2">
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
            <Button variant="outline" className="h-20 gap-2">
              <Plus className="w-4 h-4" />
              Add Faculty
            </Button>
            <Button variant="outline" className="h-20 gap-2">
              <Plus className="w-4 h-4" />
              Add Course
            </Button>
            <Button variant="outline" className="h-20 gap-2">
              <Plus className="w-4 h-4" />
              Add Department
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
