"use client";
import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { getStudentDashboard, markContentComplete, markModuleAsComplete } from '@/services/studentService'; 
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { baseAPI } from '@/utils/variables';
import { AiOutlineCheckCircle } from 'react-icons/ai';  // Use icons for better UI

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
  description?: string; // Mark as optional if it's sometimes missing
  order?: number;       // Same for order
  completed_content_count: number;
  total_content_count: number;
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
      router.push('/Login');
      return;
    }
  
    const fetchDashboard = async () => {
      try {
        const data = await getStudentDashboard(token);
        console.log("API response data:", data); // Add this line to debug
        if (data.is_active === false) {
          setIsActive(false);
        } else {
          setCourses(data.courses || []);
        }
      } catch (err) {
        setError('Erro ao carregar os dados do painel.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboard();
  }, [token, router]);
  

  const handleContentComplete = async (courseId: number, contentId: number, moduleId: number) => {
    if (!token) {
      console.error("Token is missing. Unable to complete content.");
      return; // You can add more error handling here if needed.
    }
  
    try {
      await markContentComplete(courseId, contentId, token);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                modules: course.modules.map((module) =>
                  module.id === moduleId
                    ? {
                        ...module,
                        contents: module.contents.map((content) =>
                          content.id === contentId ? { ...content, completed: true } : content
                        ),
                        completed_content_count: module.completed_content_count + 1,
                      }
                    : module
                ),
              }
            : course
        )
      );
    } catch (err) {
      console.error("Erro ao marcar o conteúdo como completo:", err);
    }
  };
  

  const handleModuleComplete = async (courseId: number, moduleId: number) => {
    if (!token) {
      console.error("Token is missing. Unable to complete module.");
      return; // Return early if token is not available
    }
  
    try {
      await markModuleAsComplete(courseId, moduleId, token);
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
    } catch (err) {
      console.error("Erro ao marcar o módulo como completo:", err);
    }
  };
  

  const renderContentItem = (content: Content, courseId: number, moduleId: number) => {
    const isCompleted = content.completed;
    return (
      <div className="flex items-center space-x-4 mb-2">
        {content.content ? (
          <p className={`text-gray-800 ${isCompleted ? 'line-through text-green-500' : ''}`}>
            {content.content}
          </p>
        ) : content.file ? (
          renderFileItem(content.file, content.title)
        ) : content.url ? (
          renderVideoItem(content.url, content.title)
        ) : (
          <p>Tipo de conteúdo desconhecido.</p>
        )}

        {!isCompleted && (
          <button
            className="text-green-500 hover:text-green-700 transition"
            onClick={() => handleContentComplete(courseId, content.id, moduleId)}
            aria-label="Marcar como completo"
          >
            <AiOutlineCheckCircle size={24} />
          </button>
        )}
        {isCompleted && (
          <span className="text-green-500">
            <AiOutlineCheckCircle size={24} />
          </span>
        )}
      </div>
    );
  };

  const renderFileItem = (file: string, title: string) => {
    const fileType = file.split('.').pop();
    if (['png', 'jpg', 'jpeg', 'gif'].includes(fileType || '')) {
      return (
        <div className="relative w-full h-64 mt-4">
          <Image
            src={`${baseAPI}${file}`}
            alt={title}
            layout="fill"
            objectFit="contain"
            className="rounded-md"
          />
        </div>
      );
    }
    if (['pdf', 'docx', 'xlsx', 'txt'].includes(fileType || '')) {
      return (
        <a
          href={`${baseAPI}${file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          {title} - Baixar Arquivo
        </a>
      );
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

  const renderModule = (module: Module, courseId: number) => {
    const moduleProgress = Math.floor((module.completed_content_count / module.total_content_count) * 100);
    return (
      <details key={module.id} className="mb-4 border-b pb-2">
        <summary className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-500">
          {module.order}. {module.title} ({moduleProgress}% concluído)
        </summary>
        <p className="text-gray-500">{module.description}</p>
        <ul className="pl-4 mt-2 space-y-2">
          {module.contents.map((content) => (
            <li key={content.id} className="text-gray-600 border-b pb-2">
              {renderContentItem(content, courseId, module.id)}
            </li>
          ))}
        </ul>
        {!module.completed && (
          <button
            className="mt-2 text-green-500 hover:text-green-700 transition"
            onClick={() => handleModuleComplete(courseId, module.id)}
          >
            Marcar Módulo Completo
          </button>
        )}
      </details>
    );
  };

  if (loading) {
    return (
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </Transition>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-6">{error}</div>;
  }

  if (!isActive) {
    return (
      <div className="text-center mt-6 text-red-600">
        Você não está ativo neste curso. Entre em contato com o tutor para ativar sua conta.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">Painel do Estudante</h1>
      {courses.length === 0 ? (
        <p className="text-center text-gray-600">Você ainda não está inscrito em nenhum curso.</p>
      ) : (
        <div className="space-y-8">
          {courses.map((course, courseIndex) => (
            <div key={courseIndex} className="border rounded-lg p-6 shadow-lg bg-white">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-600">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.overview}</p>
              <p className="text-gray-500 mb-4">
                Progresso do Curso: <span className="font-bold">{course.progress}%</span>
              </p>
              <div>
                {course.modules.map((module) => renderModule(module, course.id))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
