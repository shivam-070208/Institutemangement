import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Enrollments = () => {
  const enrollments = [
    {
      course: "CS101 - Introduction to Programming",
      students: 45,
      capacity: 50,
      status: "open",
    },
    {
      course: "MATH201 - Calculus II",
      students: 38,
      capacity: 40,
      status: "open",
    },
    {
      course: "PHY101 - Physics Fundamentals",
      students: 50,
      capacity: 50,
      status: "full",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enrollments</h1>
        <p className="text-muted-foreground">Manage student course enrollments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{enrollment.course}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-semibold">
                    {enrollment.students} / {enrollment.capacity}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${(enrollment.students / enrollment.capacity) * 100}%`,
                    }}
                  />
                </div>
                <Badge variant={enrollment.status === "open" ? "default" : "secondary"}>
                  {enrollment.status === "open" ? "Open" : "Full"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Enrollments;
