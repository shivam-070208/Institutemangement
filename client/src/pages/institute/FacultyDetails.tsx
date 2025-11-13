import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// GitHub-style attendance config
const DAYS_TO_SHOW = 30;

function getLastNDates(n: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - i);
    dates.push(dt.toISOString().slice(0, 10));
  }
  return dates;
}

interface FacultyType {
  id: number;
  name: string;
  contact_email: string;
  subjects: string[];
  uid?: number;
}

const FacultyDetails: React.FC = () => {
  const { id: facultyId } = useParams<{ id: string }>();
  const [faculty, setFaculty] = useState<FacultyType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<{
    days: string[];
    presents: number[];
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/institute/faculty/${facultyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch faculty details.");
        }
        setFaculty(data.faculty);
      } catch (err: any) {
        setError(
          err?.message || "Failed to fetch faculty details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (facultyId) fetchFaculty();
  }, [facultyId]);

  useEffect(() => {
    // Only GitHub-style data, random for now
    const days = getLastNDates(DAYS_TO_SHOW);
    const presents: number[] = [];
    for (let i = 0; i < DAYS_TO_SHOW; i++) {
      // Random: 0 = absent, 1 = present, 2 = took extra classes
      presents.push(Math.floor(Math.random() * 3));
    }
    setAttendance({ days, presents });
  }, [facultyId]);

  // GitHub-style row: fixed days, no infinite
  const attendanceRow =
    attendance?.days.map((day, idx) => {
      const value = attendance.presents[idx];
      const color =
        value === 0 ? "#e5e7eb" : value === 1 ? "#bbf7d0" : "#0ea5e9";
      return (
        <div
          key={day}
          title={`${day}: ${
            (value === 0
              ? "Absent"
              : value === 1
              ? "Present"
              : "Multiple Classes") +
            " " +
            value
          }`}
          className="transition-all border border-gray-200"
          style={{
            width: "14px",
            height: "14px",
            background: color,
            borderRadius: "2px",
            marginRight: idx < attendance.days.length - 1 ? "3px" : 0,
            opacity: value === 0 ? 0.5 : 1,
            display: "inline-block",
          }}
        ></div>
      );
    }) || null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50">
      <div className="w-full px-4 max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition text-sm"
        >
          &larr; Back
        </button>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {loading ? (
            <div className="text-center text-gray-500 py-12">
              Loading faculty details...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : faculty ? (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100 text-indigo-700 text-4xl uppercase font-bold mb-2">
                  {faculty.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h2 className="text-2xl font-semibold">{faculty.name}</h2>
                <div className="text-gray-500 text-sm">
                  Faculty ID: {faculty.id}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Subjects:</span>{" "}
                  {Array.isArray(faculty.subjects) ? (
                    faculty.subjects.length > 0 ? (
                      faculty.subjects.join(", ")
                    ) : (
                      <span className="text-gray-400">No subjects listed</span>
                    )
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
                <div>
                  <span className="font-semibold">Contact Email:</span>{" "}
                  {faculty.contact_email || (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
                {faculty.uid !== undefined && (
                  <div>
                    <span className="font-semibold">Institute UID:</span>{" "}
                    {faculty.uid}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 py-12">
              No faculty found.
            </div>
          )}
        </div>

        {/* GitHub-style Daily Presence Graph: fixed row */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Presence Pattern (GitHub Style, Last {DAYS_TO_SHOW} Days)
          </h3>
          <div className="overflow-x-auto pb-2">
            {attendanceRow ? (
              <div
                className="flex items-center mb-2"
                style={{ minWidth: DAYS_TO_SHOW * 17 }}
              >
                {attendanceRow}
              </div>
            ) : (
              <span className="text-gray-400 text-sm">No presence data.</span>
            )}
            <div className="flex justify-between text-[11px] text-gray-400">
              {attendance?.days && attendance.days.length >= 2 && (
                <>
                  <span>{attendance.days[0]}</span>
                  <span>{attendance.days[attendance.days.length - 1]}</span>
                </>
              )}
            </div>
          </div>
          <div className="mt-2 flex space-x-4 text-xs">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-[#e5e7eb] mr-1 rounded"></span>
              Absent
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-[#bbf7d0] mr-1 rounded"></span>
              Present
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-[#0ea5e9] mr-1 rounded"></span>
              Multiple Classes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetails;
