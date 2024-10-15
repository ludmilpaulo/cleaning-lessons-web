"use client";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">

          {/* Branding Section */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-2xl font-bold">Aprenda Mas</h2>
            <p className="text-sm">
              Oferecendo a melhor experiência de aprendizado online.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-8">
            <Link href="/About">
              <span className="text-sm font-medium hover:text-gray-300 cursor-pointer transition-all">
                Sobre Nós
              </span>
            </Link>
            <Link href="/contact">
              <span className="text-sm font-medium hover:text-gray-300 cursor-pointer transition-all">
                Contato
              </span>
            </Link>
            <Link href="/privacy">
              <span className="text-sm font-medium hover:text-gray-300 cursor-pointer transition-all">
                Política de Privacidade
              </span>
            </Link>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4">
            <Link href="https://www.facebook.com">
              <span className="p-3 bg-white text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all cursor-pointer">
                <FaFacebookF className="h-5 w-5" />
              </span>
            </Link>
            <Link href="https://www.twitter.com">
              <span className="p-3 bg-white text-blue-400 rounded-full hover:bg-blue-400 hover:text-white transition-all cursor-pointer">
                <FaTwitter className="h-5 w-5" />
              </span>
            </Link>
            <Link href="https://www.instagram.com">
              <span className="p-3 bg-white text-pink-500 rounded-full hover:bg-pink-500 hover:text-white transition-all cursor-pointer">
                <FaInstagram className="h-5 w-5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-sm mt-10 border-t border-white border-opacity-30 pt-4">
          <p>&copy; 2024 Minha Plataforma. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
