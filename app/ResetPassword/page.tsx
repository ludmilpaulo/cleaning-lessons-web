"use client";
import React, { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Transition } from "@headlessui/react";
import { resetPassword } from "@/services/authService";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uid || !token) {
      alert("Invalid link. Please check your email and try again.");
      router.push("/ForgotPasswordForm");
    }
  }, [uid, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(uid as string, token as string, newPassword);
      alert("Password has been reset. You can now log in.");
      router.push("/Login");
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
        </div>
      </Transition>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">
        Redefinir senha
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
            Nova Senha
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
            Confirme a nova senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition duration-200"
          >
           Redefinir senha
          </button>
        </form>
      </div>
    </div>
  );
};

const ResetPasswordDetails = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPassword />
  </Suspense>
);

export default ResetPasswordDetails;