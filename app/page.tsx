"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Transition } from "@headlessui/react"; // Import Transition

export default function Home() {
  const router = useRouter();
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    if (!auth_user) {
      // If the user is not authenticated, redirect to CourseList
      router.push("/CourseList");
    } else {
      // If authenticated, check if the user is staff
      if (auth_user.is_staff) {
        router.push("/Tutor");
      } else {
        router.push("/DashboardPage");
      }
    }
    setLoading(false); // Set loading to false after redirect
  }, [auth_user, router]);

  return (
    <>
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
    </>
  );
}
