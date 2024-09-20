"use client";
import { useState } from "react";
import axios from "axios";
import { baseAPI } from "@/utils/variables";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface AddTestProps {
  moduleId: number;
}

interface Question {
  question: string;
  type: "multiple_choice" | "text";
  options?: string[];
}

const AddTests: React.FC<AddTestProps> = ({ moduleId }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<"multiple_choice" | "text">("multiple_choice");
  const [options, setOptions] = useState<string[]>([""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const auth_user = useSelector((state: RootState) => state.auth.user);
  const token = auth_user?.token;

  // Add question to the list
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      question: questionText,
      type: questionType,
      options: questionType === "multiple_choice" ? options : undefined,
    };
    setQuestions([...questions, newQuestion]);
    setQuestionText("");
    setOptions([""]);
  };

  // Submit the test questions
  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await axios.post(
        `${baseAPI}/lessons/modules/${moduleId}/add_test/`,
        { questions, token },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setSuccessMessage("Teste adicionado com sucesso!");
      setQuestions([]);
    } catch (err) {
      setErrorMessage("Erro ao adicionar teste.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h3 className="text-xl font-bold mb-4">Adicionar Teste</h3>

      {questions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold">Questões Adicionadas:</h4>
          <ul className="list-disc pl-6">
            {questions.map((q, index) => (
              <li key={index}>
                {q.question} ({q.type === "multiple_choice" ? "Múltipla Escolha" : "Texto"})
                {q.type === "multiple_choice" && (
                  <ul className="list-inside">
                    {q.options?.map((option, i) => (
                      <li key={i}>{option}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <label className="block font-semibold">Questão:</label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border p-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Tipo de Questão:</label>
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value as "multiple_choice" | "text")}
          className="w-full border p-2 rounded-md"
        >
          <option value="multiple_choice">Múltipla Escolha</option>
          <option value="text">Texto</option>
        </select>
      </div>

      {questionType === "multiple_choice" && (
        <div className="mb-4">
          <label className="block font-semibold">Opções:</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              className="w-full border p-2 mb-2 rounded-md"
              placeholder={`Opção ${index + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={() => setOptions([...options, ""])}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Adicionar Opção
          </button>
        </div>
      )}

      <button
        onClick={handleAddQuestion}
        className="bg-indigo-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Adicionar Questão
      </button>

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded-md"
        disabled={loading}
      >
        {loading ? "Adicionando..." : "Salvar Teste"}
      </button>

      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default AddTests;
