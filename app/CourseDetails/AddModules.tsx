"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseAPI } from "@/utils/variables";

interface AddModuleProps {
  courseId: number;
  token: string;
  onClose: () => void;
  refreshModules: () => void;  // Add this prop to refresh the module list
}

const AddModules: React.FC<AddModuleProps> = ({ courseId, token, onClose, refreshModules }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [order, setOrder] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Automatically hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate the "order" field to avoid negative numbers
    if (order < 0) {
      setErrorMessage("A ordem não pode ser negativa.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${baseAPI}/lessons/courses/${courseId}/modules/`,
        {
          title,
          description,
          order,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setSuccessMessage("Módulo adicionado com sucesso!");
      setTitle("");
      setDescription("");
      setOrder(0);

      // Call refreshModules to update the module list in the parent component
      refreshModules();

      // Close the modal after successful submission
      onClose();
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

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-3 py-2 w-full"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border px-3 py-2 w-full"
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Ordem</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="border px-3 py-2 w-full"
            min="0"
            disabled={loading}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Adicionando...
              </span>
            ) : (
              "Adicionar Módulo"
            )}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddModules;
