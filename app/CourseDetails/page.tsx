"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { baseAPI } from "@/utils/variables";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import AddModulesAndContents from "./AddModulesAndContents";
import AddModules from "./AddModules";
import Image from "next/image";
import Modal from "./Modal";
import { FiLoader } from "react-icons/fi";
import { AiOutlinePlus, AiOutlineCheckCircle, AiOutlineWarning } from "react-icons/ai";

interface Module {
  id: number;
  title: string;
  description: string;
}

interface TextContent {
  content: string;
}

interface ImageContent {
  file: string;
  title: string;
}

interface VideoContent {
  url: string;
  title: string;
}

interface FileContent {
  file: string;
  title: string;
}

type ContentData = TextContent | ImageContent | VideoContent | FileContent;

interface Content {
  id: number;
  module: number;
  content_type: number;
  content_data: ContentData;
}

interface ContentTypes {
  text: number;
  image: number;
  video: number;
  file: number;
}

const CourseDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [contentTypes, setContentTypes] = useState<ContentTypes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // For module modal
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false); // For test modal
  const [newTest, setNewTest] = useState({ name: '', start_time: '', end_time: '', total_marks: '' }); // Test form state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null); // Notification state

  const auth_user = useSelector((state: RootState) => state.auth.user);
  const token = auth_user?.token;

  // Fetch content types
  useEffect(() => {
    const fetchContentTypes = async () => {
      try {
        const response = await axios.get(`${baseAPI}/lessons/get-content-types/`);
        setContentTypes(response.data);
      } catch (err) {
        setError("Failed to fetch content types.");
      }
    };

    fetchContentTypes();
  }, []);

  // Fetch modules on load
  useEffect(() => {
    const fetchModules = async () => {
      if (!courseId) return;

      try {
        const responseModules = await axios.get(`${baseAPI}/lessons/courses/${courseId}/modules/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setModules(responseModules.data);
        setError("");
      } catch (err) {
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId, token]);

  const handleModuleClick = async (module: Module) => {
    setSelectedModule(module);
    setLoading(true);

    try {
      const responseContents = await axios.post(
        `${baseAPI}/lessons/modules/${module.id}/get_contents/`,
        { token },
        {
          headers: {
            Authorization: `Token ${token}`,
          }
        }
      );
      setContents(responseContents.data);
    } catch (err) {
      setError("Failed to load module contents.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitTest = async () => {
    try {
      const token = auth_user?.token;  // Get the user's authentication token
      await axios.post(`${baseAPI}/tests/modules/${selectedModule?.id}/create_test/`,
        { test: newTest },
        {
          headers: {
            Authorization: `Token ${token}`,  // Send the token in the Authorization header
          }
        }
      );
      setNotification({ type: "success", message: "Test created successfully!" });
      setIsTestModalOpen(false);
    } catch (error) {
      setNotification({ type: "error", message: "Failed to create test. Please try again." });
    }
  };


  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 5000);  // Auto-hide notification after 5 seconds
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  const renderNotification = () => {
    if (!notification) return null;

    const Icon = notification.type === 'success' ? AiOutlineCheckCircle : AiOutlineWarning;

    return (
      <div className={`fixed top-4 right-4 p-4 text-white rounded-lg shadow-lg 
        ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
        <div className="flex items-center space-x-2">
          <Icon size={24} />
          <span>{notification.message}</span>
        </div>
      </div>
    );
  };

  // Define renderContentItem function to render each type of content
  const renderContentItem = (content: Content) => {
    if (!contentTypes) return <p>Loading content types...</p>;

    const contentType = content.content_type;

    switch (contentType) {
      case contentTypes.text:
        return <p className="text-gray-800">{(content.content_data as TextContent).content}</p>;

      case contentTypes.image:
        const imageContent = content.content_data as ImageContent;
        return (
          <div className="relative w-full h-64 mt-4">
            <Image
              src={`${baseAPI}${imageContent.file}`}
              alt={imageContent.title}
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          </div>
        );

      case contentTypes.video:
        const videoContent = content.content_data as VideoContent;
        const videoUrl = videoContent.url;
        const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

        const embedUrl = isYouTube
          ? videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
          : videoUrl;

        return isYouTube ? (
          <iframe
            className="w-full h-64 mt-4 rounded-md"
            src={embedUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={videoContent.title}
          />
        ) : (
          <video controls className="w-full h-auto mt-4 rounded-md" src={embedUrl}>
            Your browser does not support the video tag.
          </video>
        );

      case contentTypes.file:
        const fileContent = content.content_data as FileContent;
        return (
          <a
            href={`${baseAPI}${fileContent.file}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            {fileContent.title} - Download
          </a>
        );

      default:
        return <p>Unknown content type.</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-indigo-500 text-3xl" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-row space-x-4 max-w-7xl mx-auto p-6">
      {renderNotification()}

      <div className="w-1/4 bg-white p-4 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Modules</h3>
          <button
            className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            <AiOutlinePlus className="mr-1" /> Add Module
          </button>
        </div>
        {modules.length > 0 ? (
          <ul className="space-y-2">
            {modules.map((mod) => (
              <li
                key={mod.id}
                className={`cursor-pointer p-2 rounded-lg hover:bg-indigo-100 transition ${
                  selectedModule?.id === mod.id ? "bg-indigo-200" : ""
                }`}
                onClick={() => handleModuleClick(mod)}
              >
                {mod.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">This course has no modules. Add a module to start.</p>
        )}
      </div>

      <div className="w-3/4 bg-white p-6 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Module Content</h2>
          {selectedModule && (
            <AddModulesAndContents courseId={Number(courseId)} moduleId={selectedModule.id} />
          )}
        </div>

        {selectedModule ? (
          <div>
            <h3 className="text-xl font-semibold text-indigo-600">{selectedModule.title}</h3>
            <p className="text-gray-600 mb-4">{selectedModule.description}</p>

            <ul className="mt-4 space-y-2">
              {contents.length > 0 ? (
                contents.map((content) => (
                  <li key={content.id} className="p-2 border-b">
                    {renderContentItem(content)}
                  </li>
                ))
              ) : (
                <p className="text-gray-600">This module has no content. Add content to start.</p>
              )}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600">Please select a module to view its content.</p>
        )}

        {selectedModule && (
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => setIsTestModalOpen(true)}
            >
              Create Test
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AddModules courseId={Number(courseId)} token={token || ""} onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}

      {isTestModalOpen && (
        <Modal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)}>
          <h3 className="text-xl font-bold mb-4">Create Test for {selectedModule?.title}</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700">Test Name</label>
              <input
                type="text"
                name="name"
                className="w-full p-2 border rounded-md"
                placeholder="Test Name"
                value={newTest.name}
                onChange={handleTestInputChange}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                name="start_time"
                className="w-full p-2 border rounded-md"
                value={newTest.start_time}
                onChange={handleTestInputChange}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">End Time</label>
              <input
                type="datetime-local"
                name="end_time"
                className="w-full p-2 border rounded-md"
                value={newTest.end_time}
                onChange={handleTestInputChange}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Total Marks</label>
              <input
                type="number"
                name="total_marks"
                className="w-full p-2 border rounded-md"
                placeholder="Total Marks"
                value={newTest.total_marks}
                onChange={handleTestInputChange}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setIsTestModalOpen(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitTest}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
            >
              Create Test
            </button>
          </div>
        </Modal>
      )}

      {selectedModule && (
        <button
          onClick={() => window.location.href = `/live-chat?moduleId=${selectedModule.id}`}
          className="bg-green-500 text-white px-3 py-1 rounded ml-4 hover:bg-green-600"
        >
          Live Chat for {selectedModule.title}
        </button>
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
