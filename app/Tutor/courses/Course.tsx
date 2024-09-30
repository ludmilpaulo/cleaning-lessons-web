import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { useSelector } from "react-redux";
import AddCourseModal from "./AddCourseModal";

import { baseAPI } from "@/utils/variables";
import { RootState } from "@/redux/store";
import { FaEdit, FaTrashAlt, FaArrowRight } from "react-icons/fa"; // Icons
import EditCourseModal from "./EditCourseModal";

interface Course {
  id: number;
  title: string;
  overview: string;
  image: string | null;
}

const Course: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const userId = auth_user?.user_id;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userId) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${baseAPI}/lessons/courses/user/`, {
          headers: {
            Authorization: `Token ${auth_user?.token}`,
          },
        });

        if (response.data.error || response.data.length === 0) {
          setError("Nenhum curso encontrado para este usuário.");
        } else {
          setCourses(response.data);
          setError("");
        }
      } catch (err) {
        console.error(err);
        setError("Falha ao carregar os cursos.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    const intervalId = setInterval(fetchCourses, 5000);
    return () => clearInterval(intervalId);
  }, [userId, auth_user, router]);

  const handleDelete = async (courseId: number) => {
    if (!confirm("Você tem certeza que deseja deletar este curso?")) return;
    try {
      await axios.delete(`${baseAPI}/lessons/courses/${courseId}/`, {
        headers: {
          Authorization: `Token ${auth_user?.token}`,
        },
      });
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (err) {
      console.error(err);
      alert("Falha ao deletar o curso.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Meus Cursos</h1>
        <button
          className="bg-indigo-500 text-white py-2 px-6 rounded-lg hover:bg-indigo-600 transition-all duration-200 shadow-lg"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Adicionar Curso
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
            >
              <div className="relative w-full h-48">
                {course.image ? (
                  <Image
                    src={course.image}
                    alt={course.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">Sem Imagem</p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800">{course.title}</h3>
                <p className="text-gray-600 mt-2 truncate">{course.overview}</p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-all"
                    onClick={() => router.push(`/CourseDetails?courseId=${course.id}`)}
                  >
                    Acessar <FaArrowRight className="ml-2" />
                  </button>
                  <div className="flex space-x-4">
                    <button
                      className="text-yellow-500 hover:text-yellow-600 transition-all"
                      onClick={() => {
                        setSelectedCourse(course);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <FaEdit className="text-lg" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600 transition-all"
                      onClick={() => handleDelete(course.id)}
                    >
                      <FaTrashAlt className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-6">
          <p className="text-xl text-gray-700">Você ainda não tem cursos.</p>
        </div>
      )}

      {/* Modals */}
      <AddCourseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {selectedCourse && (
        <EditCourseModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          course={selectedCourse}
        />
      )}
    </div>
  );
};

export default Course;
