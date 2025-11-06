import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface StudentContextType {
  student: any | null;
  enrollmentHistory: any[] | [];
  loading: boolean;
  logout: () => void;
}

const StudentContext = createContext<StudentContextType | null>(null);

export const useStudentAuth = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudentAuth must be used within a StudentAuthProvider");
  }
  return context;
};

export const StudentAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [student, setStudent] = useState<any | null>(null);
  const [enrollmentHistory, setEnrollmentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStudentWithEnrollment = async () => {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    try {
      const response = await fetch(`${serverUrl}/api/student/studentWithEnrollment`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch student data");

      const data = await response.json();

      if (data.student) {
        setStudent(data.student);
        setEnrollmentHistory(data.enrollmentHistory || []);
      } else {
        throw new Error("Student not found");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setStudent(null);
      setEnrollmentHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentWithEnrollment();
  }, []);

  useEffect(() => {
    if (!loading && student === null) {
      navigate("/login");
    }
  }, [loading, student, navigate]);

  const logout = () => {
    setStudent(null);
    setEnrollmentHistory([]);
    navigate("/login");
  };

  return (
    <StudentContext.Provider value={{ student, enrollmentHistory, loading, logout }}>
      {children}
    </StudentContext.Provider>
  );
};
