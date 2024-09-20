// services/studentService.ts

import { Course } from "@/types/Course";
// services/studentService.ts
// services/studentService.ts
import { baseAPI } from "@/utils/variables";

// services/studentService.ts
export const getStudentDashboard = async (token: string): Promise<any> => {
    const response = await fetch(`${baseAPI}/students/dashboard/`, {
      method: 'POST',  // Ensure the method matches how you're sending the token
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),  // Send token in body
    });
  
    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(`${response.status}: ${errorMessage.detail || 'Erro ao buscar os dados do painel'}`);
    }
  
    return response.json();
  };
  
