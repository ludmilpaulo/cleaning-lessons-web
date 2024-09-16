import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseAPI } from "@/utils/variables";
import { RootState } from "@/redux/store";

interface Module {
  id: number;
  title: string;
  description: string;
}

interface AddModuleProps {
  courseId: number;
}

const AddModulesAndContents: React.FC<AddModuleProps> = ({ courseId }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [contentType, setContentType] = useState("");
  const [textContent, setTextContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [contentTypePKMapping, setContentTypePKMapping] = useState<{ [key: string]: number }>({});

  const auth_user = useSelector((state: RootState) => state.auth.user);

  // Fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`${baseAPI}/lessons/courses/${courseId}/modules/`, {
          headers: {
            Authorization: `Token ${auth_user?.token}`,
          },
        });
        setModules(response.data);
      } catch (err) {
        console.error("Failed to fetch modules", err);
      }
    };

    fetchModules();
  }, [courseId, auth_user]);

  // Fetch content types dynamically
  useEffect(() => {
    const fetchContentTypes = async () => {
      try {
        const response = await axios.get(`${baseAPI}/lessons/get-content-types/`, {
          headers: {
            Authorization: `Token ${auth_user?.token}`,
          },
        });
        setContentTypePKMapping(response.data);
      } catch (err) {
        console.error("Failed to fetch content types", err);
      }
    };

    fetchContentTypes();
  }, [auth_user]);

  const handleAddContent = async () => {
    if (!selectedModule || !contentType) {
      alert("Please select a module and content type.");
      return;
    }

    let objectId;
    try {
      // Create the specific content object first (e.g., Text, Video, Image, File)
      if (contentType === "text") {
        const textResponse = await axios.post(
          `${baseAPI}/lessons/text/`,
          { content: textContent },
          {
            headers: {
              Authorization: `Token ${auth_user?.token}`,
            },
          }
        );
        objectId = textResponse.data.id;
      } else if (contentType === "video") {
        const videoResponse = await axios.post(
          `${baseAPI}/lessons/video/`,
          { url: videoUrl },
          {
            headers: {
              Authorization: `Token ${auth_user?.token}`,
            },
          }
        );
        objectId = videoResponse.data.id;
      } else if (contentType === "image" || contentType === "file") {
        if (file) {
          const fileFormData = new FormData();
          fileFormData.append("file", file);

          const fileResponse = await axios.post(
            `${baseAPI}/lessons/file/`,
            fileFormData,
            {
              headers: {
                Authorization: `Token ${auth_user?.token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          objectId = fileResponse.data.id;
        } else {
          alert("Please upload a file.");
          return;
        }
      }

      // Now that we have the object_id, we can create the Content object
      const formData = new FormData();
      formData.append("module", String(selectedModule));
      formData.append("content_type", String(contentTypePKMapping[contentType]));
      formData.append("object_id", String(objectId));

      const response = await axios.post(
        `${baseAPI}/lessons/modules/${selectedModule}/contents/`,
        formData,
        {
          headers: {
            Authorization: `Token ${auth_user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Content added successfully!");
    } catch (err) {
      console.error("Failed to add content", err);
      alert("Failed to add content: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h3 className="text-xl mb-2">Selecione um Módulo para Adicionar Conteúdo</h3>
        <select
          className="border px-3 py-2 w-full mb-2"
          onChange={(e) => setSelectedModule(Number(e.target.value))}
        >
          <option value="">Escolha o Módulo</option>
          {modules.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h3 className="text-xl mb-2">Adicionar Conteúdo</h3>
        <select
          className="border px-3 py-2 w-full mb-2"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
        >
          <option value="">Escolha o Tipo de Conteúdo</option>
          <option value="text">Texto</option>
          <option value="image">Imagem</option>
          <option value="video">Vídeo</option>
          <option value="file">Arquivo</option>
        </select>

        {/* Render appropriate input based on content type */}
        {contentType === "text" && (
          <textarea
            className="border px-3 py-2 w-full"
            placeholder="Digite o texto"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
        )}

        {contentType === "video" && (
          <input
            type="url"
            className="border px-3 py-2 w-full"
            placeholder="URL do vídeo"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        )}

        {(contentType === "image" || contentType === "file") && (
          <input
            type="file"
            className="border px-3 py-2 w-full"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        )}

        <button
          className="mt-2 bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
          onClick={handleAddContent}
        >
          Adicionar Conteúdo
        </button>
      </div>
    </div>
  );
};

export default AddModulesAndContents;
