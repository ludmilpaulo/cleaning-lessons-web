"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { baseAPI } from "@/utils/variables";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import AddModulesAndContents from "./AddModulesAndContents";
import AddModules from "./AddModules";
import Image from "next/image";
import Modal from "./Modal";


interface Module {
  id: number;
  title: string;
  description: string;
}

interface TextContent {
  content: string;
}

interface ImageContent {
  file: string;
  title: string;
}

interface VideoContent {
  url: string;
  title: string;
}

interface FileContent {
  file: string;
  title: string;
}

type ContentData = TextContent | ImageContent | VideoContent | FileContent;

interface Content {
  id: number;
  module: number;
  content_type: number;
  content_data: ContentData;
}

interface ContentTypes {
  text: number;
  image: number;
  video: number;
  file: number;
}

const CourseDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [contentTypes, setContentTypes] = useState<ContentTypes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // For module modal
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const token = auth_user?.token;

  // Fetch content types
  useEffect(() => {
    const fetchContentTypes = async () => {
      try {
        const response = await axios.get(`${baseAPI}/lessons/get-content-types/`);
        setContentTypes(response.data);
      } catch (err) {
        console.error("Failed to fetch content types", err);
      }
    };

    fetchContentTypes();
  }, []);

  // Fetch modules and refetch every 5 seconds
  useEffect(() => {
    const fetchModules = async () => {
      if (!courseId) return;

      try {
        const responseModules = await axios.get(`${baseAPI}/lessons/courses/${courseId}/modules/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setModules(responseModules.data);
        setError("");
      } catch (err) {
        console.error("Failed to load course details", err);
        setError("Falha ao carregar os detalhes do curso.");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchModules();

    // Refetch every 5 seconds
    const intervalId = setInterval(fetchModules, 5000);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [courseId, token]);

  const handleModuleClick = async (module: Module) => {
    setSelectedModule(module);
    setLoading(true);

    try {
      const responseContents = await axios.post(
        `${baseAPI}/lessons/modules/${module.id}/get_contents/`,
        { token },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setContents(responseContents.data);
    } catch (err) {
      console.error("Failed to load module contents", err);
      setError("Falha ao carregar o conteúdo do módulo.");
    } finally {
      setLoading(false);
    }
  };

  const renderContentItem = (content: Content) => {
    if (!contentTypes) return <p>Carregando tipos de conteúdo...</p>;

    const contentType = content.content_type;

    switch (contentType) {
      case contentTypes.text:
        return <p className="text-gray-800">{(content.content_data as TextContent).content}</p>;

      case contentTypes.image:
        const imageContent = content.content_data as ImageContent;
        return (
          <div className="relative w-full h-64 mt-4">
            <Image
              src={`${baseAPI}${imageContent.file}`}
              alt={imageContent.title}
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          </div>
        );

      case contentTypes.video:
        const videoContent = content.content_data as VideoContent;
        const videoUrl = videoContent.url;
        const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

        const embedUrl = isYouTube
          ? videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
          : videoUrl;

        return isYouTube ? (
          <iframe
            className="w-full h-64 mt-4 rounded-md"
            src={embedUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={videoContent.title}
          />
        ) : (
          <video controls className="w-full h-auto mt-4 rounded-md" src={embedUrl}>
            Your browser does not support the video tag.
          </video>
        );

      case contentTypes.file:
        const fileContent = content.content_data as FileContent;
        return (
          <a
            href={`${baseAPI}${fileContent.file}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            {fileContent.title} - Download
          </a>
        );

      default:
        return <p>Tipo de conteúdo desconhecido.</p>;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="text-center text-lg">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-row space-x-4 max-w-7xl mx-auto p-6">
      <div className="w-1/4 bg-white p-4 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Módulos</h3>
          <button
            className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          >
            + Módulo
          </button>
        </div>
        {modules.length > 0 ? (
          <ul className="space-y-2">
            {modules.map((mod) => (
              <li
                key={mod.id}
                className={`cursor-pointer p-2 rounded-lg hover:bg-indigo-100 transition ${
                  selectedModule?.id === mod.id ? "bg-indigo-200" : ""
                }`}
                onClick={() => handleModuleClick(mod)}
              >
                {mod.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Este curso não possui módulos. Adicione um módulo para começar.</p>
        )}
      </div>

      <div className="w-3/4 bg-white p-6 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Conteúdo do Módulo</h2>
          {selectedModule && (
            <AddModulesAndContents courseId={Number(courseId)} moduleId={selectedModule.id} />
          )}
        </div>

        {selectedModule ? (
          <div>
            <h3 className="text-xl font-semibold text-indigo-600">{selectedModule.title}</h3>
            <p className="text-gray-600 mb-4">{selectedModule.description}</p>

            <ul className="mt-4 space-y-2">
              {contents.length > 0 ? (
                contents.map((content) => (
                  <li key={content.id} className="p-2 border-b">
                    {renderContentItem(content)}
                  </li>
                ))
              ) : (
                <p className="text-gray-600">Este módulo não tem conteúdo. Adicione um conteúdo para começar.</p>
              )}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600">Por favor, selecione um módulo para ver o conteúdo.</p>
        )}
      </div>

      {/* Modal for adding modules */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AddModules courseId={Number(courseId)} token={token || ""} onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

const CoursePage = () => (
  <Suspense fallback={<div>Carregando...</div>}>
    <CourseDetails />
  </Suspense>
);

export default CoursePage;
