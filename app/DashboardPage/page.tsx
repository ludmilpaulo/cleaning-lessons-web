"use client";
import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { getStudentDashboard } from '@/services/studentService';
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Content {
  title: string;
  content?: string;
  file?: string;
  url?: string;
}

interface Module {
  title: string;
  description: string;
  order: number;
  completed_content_count: number;
  total_content_count: number;
  contents: Content[];
}

interface Course {
  title: string;
  overview: string;
  progress: number;
  modules: Module[];
}

const StudentDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]); // Initialize with an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);  // State for student active status
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
        console.log("contents==>", data);

        if (data.is_active === false) {
          setIsActive(false);  // Student is not active
        } else {
          setCourses(data.courses || []);  // Ensure courses is an array
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message.includes('401')) {
            setError('Sua sessão expirou. Faça login novamente.');
            router.push('/Login');
          } else if (err.message.includes('403')) {
            setError('Você não tem permissão para acessar este conteúdo.');
          } else {
            setError('Erro ao carregar os dados do painel.');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, router]);

  const renderContentItem = (content: Content) => {
    if (content.content) {
      return <p className="text-gray-800">{content.content}</p>;
    } else if (content.file) {
      const fileType = content.file.split('.').pop();
      if (fileType === 'pdf' || fileType === 'docx') {
        return (
          <a
            href={content.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            {content.title} - Baixar Arquivo
          </a>
        );
      } else {
        return (
          <div className="relative w-full h-64 mt-4">
            <Image
              src={content.file}
              alt={content.title}
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          </div>
        );
      }
    } else if (content.url) {
      const isYouTube = content.url.includes("youtube.com") || content.url.includes("youtu.be");
      const embedUrl = isYouTube
        ? content.url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
        : content.url;

      return isYouTube ? (
        <iframe
          className="w-full h-64 mt-4 rounded-md"
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={content.title}
        />
      ) : (
        <video controls className="w-full h-auto mt-4 rounded-md" src={embedUrl}>
          Seu navegador não suporta a tag de vídeo.
        </video>
      );
    }

    return <p>Tipo de conteúdo desconhecido.</p>;
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

  // Display message if the student is not active
  if (!isActive) {
    return (
      <div className="text-center mt-6 text-red-600">
        Você não está ativo neste curso. Entre em contato com o tutor para ativar sua conta.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Painel do Estudante</h1>

      {courses.length === 0 ? (  // Safely check if courses is empty
        <p className="text-center text-gray-600">Você ainda não está inscrito em nenhum curso.</p>
      ) : (
        <div className="space-y-8">
          {courses.map((course, courseIndex) => (
            <div key={courseIndex} className="border rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-600">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.overview}</p>
              <p className="text-gray-500 mb-4">Progresso do Curso: {course.progress}%</p>
              <div>
                {course.modules?.length > 0 ? (  // Safely access modules and check length
                  course.modules.map((module, moduleIndex) => (
                    <details key={moduleIndex} className="mb-4">
                      <summary className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-500">
                        {module.order}. {module.title} ({module.completed_content_count}/{module.total_content_count})
                      </summary>
                      <p className="text-gray-500">{module.description}</p>
                      <ul className="pl-4 mt-2 space-y-2">
                        {module.contents?.length > 0 ? (  // Safely access contents
                          module.contents.map((content, contentIndex) => (
                            <li key={contentIndex} className="text-gray-600">
                              <span className="font-semibold">{content.title}:</span> {renderContentItem(content)}
                            </li>
                          ))
                        ) : (
                          <p className="text-gray-600">Nenhum conteúdo disponível para este módulo.</p>
                        )}
                      </ul>
                    </details>
                  ))
                ) : (
                  <p className="text-gray-600">Nenhum módulo disponível para este curso.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
