"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../redux/store";
import React from "react";

// Define the type for the props that will be passed to WrappedComponent
interface WithAuthProps {
  [key: string]: unknown; // You can adjust this to match the actual props passed to WrappedComponent
}

const withAuth = <P extends WithAuthProps>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper: React.FC<P> = (props: P) => {
    const router = useRouter();

    // Get user from redux state
    const user = useSelector((state: RootState) => state.auth.user);

    React.useEffect(() => {
      if (!user) {
        router.replace("/Login");
      }
    }, [user, router]);

    // component renders only when user is available
    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
