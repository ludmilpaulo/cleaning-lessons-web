import axios from 'axios';

const API_URL = 'http://localhost:8000/faculty/';

// Define the faculty interface
export interface FacultyInfo {
  id?: number;
  user: string;
  address: string;
  course: string;
  picture?: File | null;
}

// Get all faculties
export const getAllFaculties = async (): Promise<FacultyInfo[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get a single faculty
export const getFaculty = async (id: number): Promise<FacultyInfo> => {
  const response = await axios.get(`${API_URL}${id}/`);
  return response.data;
};

// Create a new faculty
export const createFaculty = async (facultyData: FacultyInfo): Promise<FacultyInfo> => {
  const formData = new FormData();
  Object.keys(facultyData).forEach((key) => {
    const value = facultyData[key as keyof FacultyInfo];
    if (value !== null && value !== undefined) {
      formData.append(key, value as string | Blob);
    }
  });
  const response = await axios.post(API_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Update a faculty
export const updateFaculty = async (id: number, facultyData: FacultyInfo): Promise<FacultyInfo> => {
  const formData = new FormData();
  Object.keys(facultyData).forEach((key) => {
    const value = facultyData[key as keyof FacultyInfo];
    if (value !== null && value !== undefined) {
      formData.append(key, value as string | Blob);
    }
  });
  const response = await axios.put(`${API_URL}${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Delete a faculty
export const deleteFaculty = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}${id}/`);
};
