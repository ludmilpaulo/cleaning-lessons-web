"use client";
import { useState } from "react";
import axios from "axios";
import { baseAPI } from "@/utils/variables";

interface AddModuleProps {
  courseId: number;
  token: string;  // Pass token to authenticate the user
}

const AddModules: React.FC<AddModuleProps> = ({ courseId, token }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [order, setOrder] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post(
        `${baseAPI}/lessons/courses/${courseId}/modules/`,
        {
          title,
          description,
          order,
        },
        {
          headers: {
            Authorization: `Token ${token}`,  // Pass token in the header
          },
        }
      );

      setSuccessMessage("Módulo adicionado com sucesso!");
      setTitle("");
      setDescription("");
      setOrder(0);
    } catch (err) {
      console.error("Error adding module", err);
      setErrorMessage("Falha ao adicionar o módulo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6 w-full max-w-lg mx-auto">
      <h3 className="text-xl font-semibold mb-4">Adicionar Módulo</h3>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-3 py-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border px-3 py-2 w-full"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Ordem</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="border px-3 py-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
          disabled={loading}
        >
          {loading ? "Adicionando..." : "Adicionar Módulo"}
        </button>
      </form>
    </div>
  );
};

export default AddModules;
