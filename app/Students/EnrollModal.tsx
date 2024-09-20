"use client";
import { useState } from 'react';

interface FormData {
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  id_number_or_passport: string;
  gender: string;
  date_of_birth: string;
  address: string;
}

interface EnrollModalProps {
  courseName: string;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

const EnrollModal: React.FC<EnrollModalProps> = ({ courseName, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    phone_number: '',
    id_number_or_passport: '',
    gender: '',
    date_of_birth: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData); // Call parent function to submit form data
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal container with vertical scroll */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 md:mx-auto h-full md:h-auto overflow-y-auto">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &#x2715;
        </button>

        <div className="p-8 max-h-screen">
          <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
            Inscreva-se no curso: {courseName}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Fields */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Sobrenome</label>
              <input
                type="text"
                name="surname"
                onChange={handleChange}
                value={formData.surname}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Número de Telefone</label>
              <input
                type="tel"
                name="phone_number"
                onChange={handleChange}
                value={formData.phone_number}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Número de Identidade ou Passaporte</label>
              <input
                type="text"
                name="id_number_or_passport"
                onChange={handleChange}
                value={formData.id_number_or_passport}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Gênero</label>
              <select
                name="gender"
                onChange={handleChange}
                value={formData.gender}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Selecione...</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Data de Nascimento</label>
              <input
                type="date"
                name="date_of_birth"
                onChange={handleChange}
                value={formData.date_of_birth}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Endereço</label>
              <textarea
                name="address"
                onChange={handleChange}
                value={formData.address}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition-all duration-300"
              >
                Inscrever-se
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollModal;
