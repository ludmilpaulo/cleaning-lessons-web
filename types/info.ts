"use client";
export interface AboutUsData {
  id: number;
  title: string;
  logo: string;
  back: string;
  backgroundApp: string;
  backgroundImage: string;
  about: string;
  born_date: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  linkedin: string | null;
  facebook: string;
  twitter: string;
  instagram: string;
}

export interface Comment {
  id: number;
  name: string;
  email: string;
  content: string;
  created_at: string; // Assuming there's a timestamp
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
  published_date: string;
  comments: Comment[];
}