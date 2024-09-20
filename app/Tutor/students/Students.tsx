"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseAPI } from "@/utils/variables";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface Course {
  id: number;
  title: string;
}

interface StudentProgress {
  student: string;
  progress_percentage: number;
  completed_modules: number;
  total_modules: number;
  completed_contents: number;
  total_contents: number;
}

const Students: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const token = auth_user?.token;

  // Fetch the courses that the user owns
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${baseAPI}/lessons/courses/user/`, {
          headers: {
            Authorization: `Token ${token}`, // Pass the token to authenticate
          },
        });
        setCourses(response.data);
      } catch (err) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  // Fetch the students' progress once a course is selected
  useEffect(() => {
    const fetchStudentProgress = async () => {
      if (selectedCourseId === null) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `${baseAPI}/lessons/courses/${selectedCourseId}/students-progress/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setStudentProgress(response.data);
      } catch (err) {
        setError("Failed to load students' progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProgress();
  }, [selectedCourseId, token]);

  // Handle course selection
  const handleCourseSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseId(Number(event.target.value));
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Estudantes</h2>

      {/* Course Selection */}
      <div className="mb-4">
        <label htmlFor="course-select" className="block text-lg font-medium text-gray-700">
          Selecione um curso:
        </label>
        <select
          id="course-select"
          className="border px-3 py-2 rounded w-full"
          onChange={handleCourseSelect}
          value={selectedCourseId || ""}
        >
          <option value="" disabled>
            Selecione um curso
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Students Progress */}
      {selectedCourseId && (
        <div>
          <h3 className="text-xl font-bold mb-4">Progresso dos Estudantes</h3>
          {studentProgress.length > 0 ? (
            <ul className="space-y-4">
              {studentProgress.map((student, index) => (
                <li key={index} className="border p-4 rounded-md">
                  <p className="font-semibold">Aluno: {student.student}</p>
                  <p>Progresso: {student.progress_percentage.toFixed(2)}%</p>
                  <p>Módulos Completados: {student.completed_modules} / {student.total_modules}</p>
                  <p>Conteúdos Completados: {student.completed_contents} / {student.total_contents}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Nenhum estudante inscrito no curso.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Students;
