import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { useSelector } from "react-redux";
import AddCourseModal from "./AddCourseModal";
import { baseAPI } from "@/utils/variables";
import { RootState } from "@/redux/store";

interface Course {
  id: number;
  title: string;
  overview: string;
  image: string | null; // Allow the image to be null
}

const Course: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const userId = auth_user?.user_id;

  // Fetch courses every 5 seconds
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
            Authorization: `Token ${auth_user?.token}`, // Safe access with optional chaining
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

    // Initial fetch
    fetchCourses();

    // Refetch every 5 seconds
    const intervalId = setInterval(fetchCourses, 5000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [userId, auth_user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        {/* Add Course Button */}
        <button
          className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200 shadow-md"
          onClick={() => setIsModalOpen(true)}
        >
          + Adicionar Curso
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Courses grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition hover:-translate-y-2 hover:shadow-xl duration-300"
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
                    <p className="text-gray-500">No Image</p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800">{course.title}</h3>
                <p className="text-gray-600 mt-2 truncate">{course.overview}</p>
                <button
                  className="mt-4 w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition duration-200"
                  onClick={() => router.push(`/CourseDetails?courseId=${course.id}`)}
                >
                  Acessar Curso
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-6">
          <p className="text-xl text-gray-700">Você ainda não tem cursos.</p>
          <button
            className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200 shadow-md"
            onClick={() => setIsModalOpen(true)}
          >
            + Adicionar Curso
          </button>
        </div>
      )}

      {/* Modal */}
      <AddCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Course;
