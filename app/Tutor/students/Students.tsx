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
  student_id: number;      // Use the student_id from the backend
  student_name: string;    // Use the student_name from the backend
  student_email: string;   // Use the student_email from the backend
  progress_percentage: number;
  completed_modules: number;
  total_modules: number;
  completed_contents: number;
  total_contents: number;
  is_active: boolean;
}

const Students: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const token = auth_user?.token;

  const handleDeleteStudent = async (studentId: number) => {
    console.log(`Deleting student with ID: ${studentId}`);
    try {
      await axios.post(
        `${baseAPI}/lessons/courses/${selectedCourseId}/remove-student/${studentId}/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      // Remove the student from the UI
      setStudentProgress((prev) =>
        prev.filter((student) => student.student_id !== studentId)
      );
      console.log(`Student with ID ${studentId} removed successfully`);
    } catch (error) {
      console.error(`Error deleting student with ID ${studentId}:`, error);
      setError("Falha ao remover o estudante.");
    }
  };
  

  useEffect(() => {
    const fetchCourses = async () => {
      console.log("Fetching courses...");
      try {
        const response = await axios.get(`${baseAPI}/lessons/courses/user/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setCourses(response.data);
        console.log("Courses fetched:", response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Falha ao carregar os cursos.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  useEffect(() => {
    const fetchStudentProgress = async () => {
      if (selectedCourseId === null) return;

      setLoading(true);
      console.log(`Fetching student progress for course ID: ${selectedCourseId}`);
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
        console.log("Student progress fetched:", response.data);
      } catch (err) {
        console.error("Error fetching student progress:", err);
        setError("Falha ao carregar o progresso dos estudantes.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProgress();
  }, [selectedCourseId, token]);

  const handleCourseSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseId(Number(event.target.value));
    console.log(`Course selected: ${event.target.value}`);
  };

  const handleActivateStudent = async (studentId: number) => {
    console.log(`Activating student with ID: ${studentId}`);
    try {
      await axios.post(
        `${baseAPI}/lessons/courses/${selectedCourseId}/activate-student/${studentId}/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,  // Ensure this token is valid
          },
        }
      );
      setStudentProgress((prev) =>
        prev.map((student) =>
          student.student_id === studentId ? { ...student, is_active: true } : student
        )
      );
      console.log(`Student with ID ${studentId} activated successfully`);
    } catch (error) {
      console.error(`Error activating student with ID ${studentId}:`, error);
      setError("Falha ao ativar o estudante.");
    }
};

const handleDeactivateStudent = async (studentId: number) => {
    console.log(`Deactivating student with ID: ${studentId}`);
    try {
      await axios.post(
        `${baseAPI}/students/courses/${selectedCourseId}/deactivate-student/${studentId}/`,  // Ensure this matches your Django URLs
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setStudentProgress((prev) =>
        prev.map((student) =>
          student.student_id === studentId ? { ...student, is_active: false } : student
        )
      );
      console.log(`Student with ID ${studentId} deactivated successfully`);
    } catch (error) {
      console.error(`Error deactivating student with ID ${studentId}:`, error);
      setError("Falha ao desativar o estudante.");
    }
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

      {selectedCourseId && (
        <div>
          <h3 className="text-xl font-bold mb-4">Progresso dos Estudantes</h3>
          {studentProgress.length > 0 ? (
            <ul className="space-y-4">
             {studentProgress.map((student) => (
  <li key={student.student_id} className="border p-4 rounded-md">
    <p className="font-semibold">Aluno: {student.student}</p>
    <p>Progresso: {student.progress_percentage.toFixed(2)}%</p>
    <p>Módulos Completos: {student.completed_modules} / {student.total_modules}</p>
    <p>Conteúdos Completos: {student.completed_contents} / {student.total_contents}</p>
    <p>Status: {student.is_active ? "Ativo" : "Desativado"}</p>
    <div className="flex space-x-2 mt-2">
      {student.is_active ? (
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={() => handleDeactivateStudent(student.student_id)}
        >
          Desativar
        </button>
      ) : (
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={() => handleActivateStudent(student.student_id)}
        >
          Ativar
        </button>
      )}
      <button
        className="bg-gray-500 text-white px-3 py-1 rounded"
        onClick={() => handleDeleteStudent(student.student_id)}
      >
        Remover
      </button>
    </div>
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
