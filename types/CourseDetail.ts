// types/CourseDetail.ts
import { Course, Module } from './Course';


export interface CourseDetail extends Course {
  modules: Module[]; // Each course will have an array of modules
}

export interface CourseListApiResponse {
    courses: Course[];
  }


  export interface CourseDetailApiResponse {
    course: CourseDetail;
  }