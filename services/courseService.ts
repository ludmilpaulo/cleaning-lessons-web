// services/courseService.ts
import { Course, EnrollmentResponse } from '@/types/Course';
import { CourseDetail } from '@/types/CourseDetail';
import { baseAPI } from '@/utils/variables';
import axios from 'axios';


const API_URL = baseAPI;

export const getCourses = async (): Promise<Course[]> => {
  const response = await axios.get<Course[]>(`${API_URL}/students/courses/`);
  return response.data;
};

export const getCourseDetail = async (courseId: string): Promise<CourseDetail> => {
  const response = await axios.get<CourseDetail>(`${API_URL}/students/courses/${courseId}/`);
  return response.data;
};

export const enrollInCourse = async (courseId: string): Promise<EnrollmentResponse> => {
  const response = await axios.post<EnrollmentResponse>(
    `${API_URL}/students/courses/${courseId}/enroll/`,
    {},
    { withCredentials: true }
  );
  return response.data;
};
