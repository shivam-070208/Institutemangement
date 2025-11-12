import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "../../components/layout";

interface FacultyType {
  faculty_id: number;
  name: string;
  subjects: string;
  contact_email: string;
  // Add other faculty properties if needed
}

const FacultyDetails: React.FC = () => {
  const { faculty_id } = useParams<{ faculty_id: string }>();
  const [faculty, setFaculty] = useState<FacultyType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/institute/faculty/${faculty_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

    if (faculty_id) fetchFaculty();
  }, [faculty_id]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <div className="py-8 max-w-2xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-5 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
        >
          &larr; Back
        </button>
        {loading ? (
          <div className="text-center">Loading faculty details...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : faculty ? (
          <div className="bg-white shadow rounded p-6">
            <h2 className="text-2xl font-bold mb-4">{faculty.name}</h2>
            <div className="flex flex-col gap-4">
              <div>
                <span className="font-semibold">Faculty ID: </span>
                {faculty.faculty_id}
              </div>
              <div>
                <span className="font-semibold">Subjects: </span>
                {faculty.subjects}
              </div>
              <div>
                <span className="font-semibold">Contact Email: </span>
                {faculty.contact_email}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center">No faculty found.</div>
        )}
      </div>
    </Container>
  );
};

export default FacultyDetails;


