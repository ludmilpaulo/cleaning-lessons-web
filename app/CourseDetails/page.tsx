"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { baseAPI } from "@/utils/variables";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import AddModulesAndContents from "./AddModulesAndContents";
import AddModules from "./AddModules";
import Modal from "./Modal";
import Image from "next/image";
import { FiLoader } from "react-icons/fi";
import {
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheckCircle,
  AiOutlineWarning,
} from "react-icons/ai";

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

interface Notification {
  type: "success" | "error";
  message: string;
}

const CourseDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contentTypes, setContentTypes] = useState<ContentTypes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [notification, setNotification] = useState<Notification | null>(null);
  const [contentToEdit, setContentToEdit] = useState<Content | null>(null);
  const [editContentModalOpen, setEditContentModalOpen] = useState(false);

  const auth_user = useSelector((state: RootState) => state.auth.user);
  const token = auth_user?.token;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const fetchContentTypes = async () => {
      try {
        const response = await axios.get(`${baseAPI}/lessons/get-content-types/`);
        setContentTypes(response.data);
      } catch {
        setError("Falha ao buscar tipos de conteúdo.");
      }
    };

    fetchContentTypes();
  }, []);

  const fetchModules = useCallback(async () => {
    if (!courseId) return;

    try {
      const responseModules = await axios.get(`${baseAPI}/lessons/courses/${courseId}/modules/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setModules(responseModules.data);
      setError("");
    } catch {
      setError("Falha ao carregar detalhes do curso.");
    } finally {
      setLoading(false);
    }
  }, [courseId, token]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

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
    } catch {
      setError("Falha ao carregar conteúdos do módulo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    try {
      await axios.delete(`${baseAPI}/lessons/contents/${contentId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setContents(contents.filter((content) => content.id !== contentId));
      setNotification({ type: "success", message: "Conteúdo deletado com sucesso." });
    } catch {
      setNotification({ type: "error", message: "Falha ao deletar conteúdo." });
    }
  };

  const handleEditContentSubmit = async (updatedContentData: ContentData) => {
    if (!contentToEdit) return;

    try {
      await axios.put(
        `${baseAPI}/lessons/contents/${contentToEdit.id}/`,
        {
          content_data: updatedContentData,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setContents(
        contents.map((content) =>
          content.id === contentToEdit.id
            ? { ...content, content_data: updatedContentData }
            : content
        )
      );
      setNotification({ type: "success", message: "Conteúdo editado com sucesso." });
      setEditContentModalOpen(false);
    } catch {
      setNotification({ type: "error", message: "Falha ao editar conteúdo." });
    }
  };

  const renderNotification = () => {
    if (!notification) return null;

    const Icon = notification.type === "success" ? AiOutlineCheckCircle : AiOutlineWarning;

    return (
      <div
        className={`fixed top-4 right-4 p-4 text-white rounded-lg shadow-lg ${
          notification.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <div className="flex items-center space-x-2">
          <Icon size={24} />
          <span>{notification.message}</span>
        </div>
      </div>
    );
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
        const isYouTube =
          videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

        const embedUrl = isYouTube
          ? videoUrl
              .replace("watch?v=", "embed/")
              .replace("youtu.be/", "youtube.com/embed/")
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
            Seu navegador não suporta a tag de vídeo.
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
            {fileContent.title} - Baixar
          </a>
        );

      default:
        return <p>Tipo de conteúdo desconhecido.</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-indigo-500 text-3xl" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-row space-x-4 max-w-7xl mx-auto p-6">
      {renderNotification()}

      <div className="w-1/4 bg-white p-4 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Módulos</h3>
          <button
            className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            <AiOutlinePlus className="mr-1" /> Adicionar Módulo
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
              >
                <div className="flex justify-between items-center">
                  <span onClick={() => handleModuleClick(mod)}>{mod.title}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Este curso não tem módulos. Adicione um módulo para começar.</p>
        )}
      </div>

      <div className="w-3/4 bg-white p-6 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Conteúdo do Módulo</h2>
          {selectedModule && (
            <AddModulesAndContents
              courseId={Number(courseId)}
              moduleId={selectedModule.id}
              onContentAdded={() => handleModuleClick(selectedModule)} // Refetch contents after adding
            />
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
                    <div className="flex space-x-2 mt-2">
                      <AiOutlineEdit
                        className="text-indigo-500 cursor-pointer"
                        onClick={() => {
                          setContentToEdit(content);
                          setEditContentModalOpen(true);
                        }}
                      />
                      <AiOutlineDelete
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteContent(content.id)}
                      />
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-600">Este módulo não tem conteúdo. Adicione conteúdo para começar.</p>
              )}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600">Por favor, selecione um módulo para ver seu conteúdo.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AddModules
            courseId={Number(courseId)}
            token={token || ""}
            onClose={() => setIsModalOpen(false)}
            refreshModules={fetchModules}
          />
        </Modal>
      )}

      {editContentModalOpen && contentToEdit && (
        <Modal isOpen={editContentModalOpen} onClose={() => setEditContentModalOpen(false)}>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-4">Editar Conteúdo</h3>
            <textarea
              value={(contentToEdit.content_data as TextContent).content || ""}
              onChange={(e) =>
                setContentToEdit({
                  ...contentToEdit,
                  content_data: { ...(contentToEdit.content_data as TextContent), content: e.target.value },
                })
              }
              className="mb-2 p-2 w-full border rounded"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setEditContentModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded"
                onClick={() => handleEditContentSubmit(contentToEdit.content_data)}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const CoursePage: React.FC = () => (
  <Suspense fallback={<div>Carregando...</div>}>
    <CourseDetails />
  </Suspense>
);

export default CoursePage;
