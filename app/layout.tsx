import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import StoreProvider from "@/redux/StoreProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Aprenda Mas - Plataforma de Aprendizado Online",
  description: "Aprenda mais com nossa plataforma online. Cursos criados por especialistas para impulsionar seu aprendizado. Junte-se a nós agora!",
  keywords: "cursos online, aprendizado online, desenvolvimento web, marketing digital, Aprenda Mas",
  openGraph: {
    title: "Aprenda Mas - A Melhor Plataforma de Aprendizado Online",
    description: "Explore cursos criados por especialistas e amplie suas habilidades em várias áreas como desenvolvimento web, marketing digital, e mais.",
    url: "https://www.aprendamas.com",
    siteName: "Aprenda Mas",
    images: [
      {
        url: "https://www.aprendamas.com/images/logo.png",
        width: 800,
        height: 600,
        alt: "Aprenda Mas Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@aprendamas",
    title: "Aprenda Mas - Plataforma de Aprendizado Online",
    description: "Junte-se à Aprenda Mas e amplie suas habilidades com cursos online criados por especialistas.",
    images: [
      {
        url: "https://www.aprendamas.com/images/logo.png",
        width: 800,
        height: 600,
        alt: "Aprenda Mas Logo",
      },
    ],
  },
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",  // Allow indexing by search engines
  canonical: "https://www.aprendamas.com",  // Canonical URL
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Navbar /> 
        {children}
        <Footer /> 
      </body>
    </html>
    </StoreProvider>
  );
}
