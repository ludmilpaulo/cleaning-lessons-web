"use client";
import { Suspense, useEffect, useState } from 'react';
import {useRouter, useSearchParams } from 'next/navigation'; // to get courseId from the query
import { getCourseDetail } from '@/services/courseService'; // Assuming the API service exists
import EnrollModal from './EnrollModal';
import { Transition } from '@headlessui/react';
import { baseAPI } from '@/utils/variables';
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";

interface FormData {
  name: string;
  surname: string;
  email: string;
  phone_number: string;

  gender: string;

  address: string;
}




const CourseDetail: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId'); // Get courseId from query parameters

  useEffect(() => {
    if (courseId) {
      const fetchCourseData = async () => {
        try {
          const course = await getCourseDetail(courseId); // Fetch course details from API
          setCourseName(course.title);
          setCourseDescription(course.overview);
        } catch (error) {
          console.error('Failed to fetch course details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCourseData();
    }
  }, [courseId]);

  const handleEnroll = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const payload = {
      ...formData,
      course_id: courseId,  // Include courseId in the payload
    };
  
    try {
      const response = await fetch(`${baseAPI}/students/enroll/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),  // Send the payload including courseId
      });
  
      if (response.ok) {
        const userData = await response.json();
        alert('Inscrição realizada com sucesso!');
        dispatch(loginUser(userData));
        router.push("/DashboardPage");
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div><Transition
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
</Transition></div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 px-6">
      {/* Course Description Section */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">{courseName}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          {courseDescription}
        </p>
        <p className="text-indigo-600 font-semibold mb-2">
          🚀 Comece sua jornada de aprendizado agora!
        </p>
      </div>

      {/* Call to Action */}
      <button
        onClick={handleEnroll}
        className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg hover:bg-indigo-500 transition-colors duration-300 shadow-lg"
      >
        Inscreva-se Agora
      </button>

      {/* Modal */}
      {isModalOpen && (
        <EnrollModal
          courseName={courseName}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

const StudentPage = () => (
    <Suspense fallback={<div>Carregando...</div>}>
      <CourseDetail />
    </Suspense>
);

export default StudentPage;

