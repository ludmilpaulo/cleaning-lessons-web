"use client"; // Ensure this page is rendered on the client side
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { baseAPI } from "@/utils/variables";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import AddModulesAndContents from "./AddModulesAndContents";

interface Module {
  id: number;
  title: string;
  description: string;
}

interface Content {
  id: number;
  module: number; // Ensure you have module id associated with content
  content_type: string;
  item: string | number; // Specify the actual type of 'item'
}

const CourseDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [modules, setModules] = useState<Module[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const auth_user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;

      try {
        const responseModules = await axios.get(`${baseAPI}/lessons/courses/${courseId}/modules/`, {
          headers: {
            Authorization: `Token ${auth_user?.token}`,
          },
        });
        setModules(responseModules.data);

        const moduleContents: Content[] = [];
        for (const mod of responseModules.data) {
          const responseContents = await axios.get(`${baseAPI}/lessons/modules_view/${mod.id}/contents/`,{
            headers: {
                Authorization: `Token ${auth_user?.token}`,
            },
        });

          
          moduleContents.push(...responseContents.data.map((content: Content) => ({
            ...content,
            module: mod.id,
          })));
        }
        setContents(moduleContents);
      } catch (err) {
        console.error("Failed to load course details", err);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, auth_user?.token]);

  if (loading) {
    return <p>Loading course details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Detalhes do Curso</h2>
        <AddModulesAndContents courseId={Number(courseId)} />
      </div>

      {modules.length > 0 ? (
        <div>
          {modules.map((mod) => (
            <div key={mod.id} className="mb-6">
              <h3 className="text-xl font-semibold">{mod.title}</h3>
              <p>{mod.description}</p>

              <ul className="mt-4">
                {contents
                  .filter((content) => content.module === mod.id)
                  .map((content) => (
                    <li key={content.id} className="mb-2">
                      {content.content_type}: {content.item}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>Este curso não tem módulos.</p>
      )}
    </div>
  );
};

const CoursePage = () => (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseDetails />
    </Suspense>
  );

export default CoursePage;
