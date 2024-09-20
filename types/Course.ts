// types/Course.ts
export interface Course {
    id: number;
    title: string;
    slug: string;
    overview: string;
    image?: string; // Image can be optional
    created: string; // ISO date string for when the course was created
  }
// types/Module.ts
export interface Module {
    id: number;
    title: string;
    description: string;
    order: number;
  }
 // types/Content.ts
export interface Content {
    id: number;
    content_type: string; // e.g., 'text', 'video', 'file', 'image'
    order: number;
    object_id: number; // The ID of the content item (text, video, file, image)
    title: string;
    url?: string; // For video content or external links
    file?: string; // For files and images (optional if content is text or video)
  }

  // types/Progress.ts
export interface CourseProgress {
    courseId: number;
    studentId: number;
    completedModules: number[]; // Array of module IDs that the student has completed
    completedContents: number[]; // Array of content IDs that the student has completed
    lastAccessedModule?: number; // Optional ID of the last module the student accessed
  }
 
// types/Enrollment.ts
export interface EnrollmentResponse {
    success: boolean;
    message: string;
  }
  