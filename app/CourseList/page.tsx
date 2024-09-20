"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCourses } from '@/services/courseService';
import { Course } from '@/types/Course';

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error('Falha ao buscar cursos', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Carregando cursos...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Cursos Disponíveis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {course.image && (
              <div className="relative w-full h-48">
                <Image 
                  src={course.image} 
                  alt={course.title} 
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.overview}</p>
              
              {/* Pass course.id in the Link */}
              <Link href={`/Students?courseId=${course.id}`} passHref>
                <span className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors duration-300">
                  Ver Curso
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
