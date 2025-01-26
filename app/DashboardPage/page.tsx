"use client";

import { useEffect, useState } from "react";
import { getStudentDashboard } from "@/services/studentService";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import { baseAPI } from "@/utils/variables";

interface Content {
  id: number;
  title: string;
  content?: string;
  file?: string;
  url?: string;
  completed: boolean;
}

interface Module {
  id: number;
  title: string;
  description?: string;
  order?: number;
  contents: Content[];
  completed: boolean;
}

interface Course {
  id: number;
  title: string;
  overview: string;
  progress: number;
  modules: Module[];
}

const StudentDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const token = auth_user?.token;
  const router = useRouter();
  

  useEffect(() => {
    if (!token) {
      router.push("/Login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const data = await getStudentDashboard(token);
        console.log("Fetched Dashboard Data:", data); // Debug fetched data
        if (!data.is_active) {
          setIsActive(false);
        } else {
          setCourses(data.courses || []);
          console.log("Courses Set in State:", data.courses); // Debug courses
        }
      } catch (err) {
        setError("Ocorreu um erro ao carregar o painel.");
        console.error("Error fetching dashboard:", err); // Debug errors
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, router]);

  const handleModuleComplete = async (courseId: number, moduleId: number) => {
    console.log("handleModuleComplete called with:", { courseId, moduleId }); // Debugging IDs
    if (!token) return;

    try {
      const response = await fetch(`${baseAPI}/lessons/mark_module_complete/${courseId}/${moduleId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Response Error:", errorData); // Debug API error
        throw new Error(errorData.error || "Erro ao marcar o módulo como completo.");
      }

      const data = await response.json();
      console.log("API Success Response:", data); // Debug API success response

      // Update the frontend state to mark the module as completed
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                modules: course.modules.map((module) =>
                  module.id === moduleId ? { ...module, completed: true } : module
                ),
              }
            : course
        )
      );
    } catch  {
      console.error("Erro ao marcar o módulo como completo:");
    }
  };

  const renderVideoItem = (url: string, title: string) => {
    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
    const embedUrl = isYouTube
      ? url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
      : url;

    return isYouTube ? (
      <iframe
        className="w-full h-64 mt-4 rounded-md shadow-md"
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    ) : (
      <video controls className="w-full h-auto mt-4 rounded-md" src={embedUrl}>
        Seu navegador não suporta a tag de vídeo.
      </video>
    );
  };

  const renderContentItem = (content: Content) => {
    if (content.content) {
      return <p className="text-gray-700">{content.content}</p>; // Render text
    }
    if (content.file) {
      return (
        <a
          href={`${baseAPI}${content.file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          Baixar Arquivo
        </a>
      ); // Render file link
    }
    if (content.url) {
      return renderVideoItem(content.url, content.title); // Render video using renderVideoItem
    }
    return <p className="text-gray-500">Conteúdo inválido</p>;
  };

  const renderModule = (module: Module, courseId: number) => {
    console.log("Rendering Module:", { courseId, moduleId: module.id }); // Debugging module rendering
    return (
      <div key={module.id} className="mb-6 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2 text-indigo-600">
          {module.order}. {module.title}
        </h3>
        <p className="text-sm text-gray-500">{module.description || "Sem descrição disponível."}</p>
        <div className="mt-4 space-y-4">
          {module.contents.map((content) => (
            <div key={content.id} className="border-b pb-2">
              {renderContentItem(content)}
            </div>
          ))}
        </div>
        {!module.completed && (
          <button
            onClick={() => handleModuleComplete(courseId, module.id)} // Pass courseId and moduleId
            className="mt-4 w-full text-center text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition"
          >
            Marcar Módulo Completo
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="text-indigo-600 text-5xl animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="text-center text-red-600 mt-8">
        Você não está ativo neste curso. Entre em contato com o administrador.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">Painel do Estudante</h1>
      {courses.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum curso disponível.</p>
      ) : (
        <div className="space-y-8">
          {courses.map((course) => {
            console.log("Rendering Course:", course.id); // Debug course rendering
            return (
              <div key={course.id} className="bg-gray-50 shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
                <p className="text-gray-500">{course.overview}</p>
                <div className="mt-4">
                  {course.modules.map((module) => renderModule(module, course.id))} {/* Pass course.id */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
