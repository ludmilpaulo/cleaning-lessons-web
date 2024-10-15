import axios from 'axios';
import { baseAPI } from '@/utils/variables';

// Define the expected structure for the dashboard data
interface Content {
  id: number;
  title: string;
  completed: boolean;
  content?: string;
  file?: string;
  url?: string;
}

interface Module {
  id: number;
  title: string;
  completed: boolean;
  completed_content_count: number;
  total_content_count: number;
  contents: Content[];
}

interface Course {
  id: number;
  title: string;
  progress: number;
  overview: string;
  modules: Module[];
}

interface StudentDashboardData {
  is_active: boolean;
  courses: Course[];
}

// services/studentService.ts

export const getStudentDashboard = async (token: string): Promise<StudentDashboardData> => {
  const response = await fetch(`${baseAPI}/students/dashboard/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(`${response.status}: ${errorMessage.detail || 'Erro ao buscar os dados do painel'}`);
  }

  return response.json() as Promise<StudentDashboardData>;
};

export const markContentComplete = async (courseId: number, contentId: number, token: string): Promise<void> => {
  try {
    const response = await axios.post(
      `${baseAPI}/lessons/courses/${courseId}/content/${contentId}/complete/`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    console.log("Content marked as complete:", response.data);
  } catch (error) {
    console.error("Failed to mark content as complete:", error);
  }
};

export const markModuleAsComplete = async (courseId: number, moduleId: number, token: string): Promise<void> => {
  try {
    const response = await axios.post(
      `${baseAPI}/lessons/courses/${courseId}/module/${moduleId}/complete/`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    console.log("Module marked as complete:", response.data);
  } catch (error) {
    console.error("Failed to mark module as complete:", error);
  }
};
