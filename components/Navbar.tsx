"use client";
import Link from "next/link";
import { useState } from "react";
import {
  FaHome,
  FaBook,
  FaInfoCircle,
  FaPhone,
  FaSignInAlt,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logoutUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer state
  const auth_user = useSelector((state: RootState) => state.auth.user); // Get authenticated user
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch logout action
    router.push("/Login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <span className="text-white text-2xl font-bold cursor-pointer">
                Aprenda Mas
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/">
                <span className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
                  <FaHome className="mr-2" /> Início
                </span>
              </Link>
              <Link href="/CourseList">
                <span className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
                  <FaBook className="mr-2" /> Cursos
                </span>
              </Link>
              <Link href="/About">
                <span className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
                  <FaInfoCircle className="mr-2" /> Sobre
                </span>
              </Link>
              <Link href="/contact">
                <span className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
                  <FaPhone className="mr-2" /> Contato
                </span>
              </Link>

              {/* Authenticated User Links */}
              {auth_user ? (
                <>
                  {/* Conditional Rendering: Staff or Student Dashboard */}
                  {auth_user.is_staff ? (
                    <Link href="/Tutor">
                      <span className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
                        <FaUserCircle className="mr-2" /> Painel do Tutor
                      </span>
                    </Link>
                  ) : (
                    <Link href="/DashboardPage">
                      <span className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
                        <FaUserCircle className="mr-2" /> Meu Painel
                      </span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-all cursor-pointer flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" /> Sair
                  </button>
                </>
              ) : (
                <Link href="/Login">
                  <span className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
                    <FaSignInAlt className="mr-2" /> Entrar
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsDrawerOpen(true)} // Open the drawer
              className="text-white inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Menu for Mobile */}
      <div
        className={`fixed top-0 left-0 w-64 bg-gradient-to-r from-blue-500 to-indigo-600 h-full z-40 transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-4">
          <span className="text-white text-2xl font-bold">Menu</span>
          <button
            onClick={() => setIsDrawerOpen(false)} // Close the drawer
            className="text-white"
          >
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="px-4">
          <Link href="/">
            <span className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
              <FaHome className="mr-2" /> Início
            </span>
          </Link>
          <Link href="/courses">
            <span className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
              <FaBook className="mr-2" /> Cursos
            </span>
          </Link>
          <Link href="/about">
            <span className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
              <FaInfoCircle className="mr-2" /> Sobre
            </span>
          </Link>
          <Link href="/contact">
            <span className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
              <FaPhone className="mr-2" /> Contato
            </span>
          </Link>

          {/* Authenticated User Links for Mobile */}
          {auth_user ? (
            <>
              {/* Conditional Rendering: Staff or Student Dashboard */}
              {auth_user.is_staff ? (
                <Link href="/Tutor">
                  <span className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
                    <FaUserCircle className="mr-2" /> Painel do Tutor
                  </span>
                </Link>
              ) : (
                <Link href="/DashboardPage">
                  <span className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
                    <FaUserCircle className="mr-2" /> Meu Painel
                  </span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 transition-all cursor-pointer flex items-center w-full"
              >
                <FaSignOutAlt className="mr-2" /> Sair
              </button>
            </>
          ) : (
            <Link href="/Login">
              <span className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-all cursor-pointer flex items-center">
                <FaSignInAlt className="mr-2" /> Entrar
              </span>
            </Link>
          )}
        </nav>
      </div>

      {/* Overlay when drawer is open */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </nav>
  );
};

export default Navbar;
