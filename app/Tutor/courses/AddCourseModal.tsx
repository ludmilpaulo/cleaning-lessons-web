import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { baseAPI } from "@/utils/variables";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Subject {
  id: number;
  title: string;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [subjectTitle, setSubjectTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);  // Added for image upload
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error ] = useState<string>("");

  const auth_user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${baseAPI}/lessons/subjects/`);
        setSubjects(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubjects();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);  // Set the selected image file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("overview", overview);

      // Handle subject selection or creation
      if (subjectId) {
        formData.append("subject", String(subjectId));
      } else {
        formData.append("subject_title", subjectTitle);
      }

      // Append the image file if provided
      if (image) {
        formData.append("image", image);
      }

     
    const response = await axios.post(
    `${baseAPI}/lessons/courses/`,
    formData,
    {
        headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${auth_user?.token}`, // Include the JWT token
        },
    }
    );

      if (response.status === 201) {
        onClose();
        alert("Curso adicionado com sucessul");
      }
    } catch (err) {
      console.error(err);
      alert("Falha ao criar o curso. Por favor, tente novamente.");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Adicionar Novo Curso
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Título do Curso</label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Visão Geral</label>
                    <textarea
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={overview}
                      onChange={(e) => setOverview(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Assunto</label>
                    <select
                      value={subjectId ?? ""}
                      onChange={(e) => setSubjectId(Number(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Selecione um assunto</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.title}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Ou adicione um novo assunto"
                      className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={subjectTitle}
                      onChange={(e) => setSubjectTitle(e.target.value)}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Imagem de Capa</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      onChange={handleImageChange}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Criar Curso
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddCourseModal;
