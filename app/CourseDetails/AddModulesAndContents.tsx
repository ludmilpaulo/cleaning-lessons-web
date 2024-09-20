"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { baseAPI } from "@/utils/variables";

interface Module {
  id: number;
  title: string;
  description: string;
}

interface AddModuleProps {
  courseId: number;
  moduleId: number; // Selected Module ID to which content will be added
}

const AddModulesAndContents: React.FC<AddModuleProps> = ({ courseId, moduleId }) => {
  const [contentType, setContentType] = useState("");
  const [textContent, setTextContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const auth_user = useSelector((state: RootState) => state.auth.user);

  const handleAddContent = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!contentType) {
      setErrorMessage("Please select a content type.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("content_type", contentType);
    formData.append("module", String(moduleId));

    if (auth_user?.token) {
      formData.append("token", auth_user.token);
    } else {
      setErrorMessage("Token is missing.");
      setLoading(false);
      return;
    }

    if (contentType === "text" && textContent) {
      formData.append("content", textContent);
    } else if (contentType === "video" && videoUrl) {
      formData.append("url", videoUrl);
    } else if ((contentType === "image" || contentType === "file") && file) {
      formData.append("file", file);
    } else {
      setErrorMessage("Please provide content data.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${baseAPI}/lessons/modules/${moduleId}/contents/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage("Content added successfully!");
    } catch (err) {
      console.error("Failed to add content", err);
      setErrorMessage("Failed to add content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 w-full max-w-lg">
      <h3 className="text-xl font-semibold mb-4">Adicionar Conteúdo</h3>
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}

      <select
        className="border px-3 py-2 w-full mb-4"
        value={contentType}
        onChange={(e) => setContentType(e.target.value)}
      >
        <option value="">Escolha o Tipo de Conteúdo</option>
        <option value="text">Texto</option>
        <option value="image">Imagem</option>
        <option value="video">Vídeo</option>
        <option value="file">Arquivo</option>
      </select>

      {contentType === "text" && (
        <textarea
          className="border px-3 py-2 w-full"
          placeholder="Digite o conteúdo de texto"
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
        className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 disabled:bg-indigo-300"
        onClick={handleAddContent}
        disabled={loading}
      >
        {loading ? "Adicionando..." : "Adicionar Conteúdo"}
      </button>
    </div>
  );
};

export default AddModulesAndContents;
