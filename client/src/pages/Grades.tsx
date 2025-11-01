import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Grades = () => {
  const gradeData = [
    {
      student: "John Doe",
      course: "CS101",
      grade: "A",
      percentage: 92,
    },
    {
      student: "Jane Smith",
      course: "MATH201",
      grade: "B+",
      percentage: 87,
    },
    {
      student: "Bob Johnson",
      course: "PHY101",
      grade: "A-",
      percentage: 90,
    },
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-success";
    if (grade.startsWith("B")) return "bg-primary";
    if (grade.startsWith("C")) return "bg-[hsl(45,93%,47%)]";
    return "bg-destructive";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grades</h1>
        <p className="text-muted-foreground">View and manage student grades</p>
      </div>

      <div className="grid gap-6">
        {gradeData.map((record, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{record.student}</CardTitle>
                <Badge className={getGradeColor(record.grade)}>
                  {record.grade}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course</span>
                  <span className="font-medium">{record.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Percentage</span>
                  <span className="font-medium">{record.percentage}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Grades;
