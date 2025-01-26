"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseAPI } from "@/utils/variables";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface StudentProgress {
  student: string;
  progress_percentage: number;
  completed_modules: number;
  total_modules: number;
  completed_contents: number;
  total_contents: number;
}

const StudentsProgress: React.FC<{ courseId: number }> = ({ courseId }) => {
  const [progressData, setProgressData] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const token = auth_user?.token;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`${baseAPI}/lessons/courses/${courseId}/students-progress/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setProgressData(response.data);
      } catch {
        setError("Failed to load students' progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [courseId, token]);

  if (loading) {
    return <p>Carregando progresso dos alunos...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Progresso dos Alunos</h2>
      <ul className="space-y-4">
        {progressData.map((student, index) => (
          <li key={index} className="border p-4 rounded-md">
            <p className="font-semibold">Aluno: {student.student}</p>
            <p>Progresso: {student.progress_percentage.toFixed(2)}%</p>
            <p>Módulos Completados: {student.completed_modules} / {student.total_modules}</p>
            <p>Conteúdos Completados: {student.completed_contents} / {student.total_contents}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentsProgress;
