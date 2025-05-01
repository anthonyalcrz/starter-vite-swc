// src/components/auth/protectedroute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: string;
}

type ExtendedProfile = {
  role?: string;
};

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, profile, loading } = useUserData();
  const location = useLocation();

  const extendedProfile = profile as typeof profile & ExtendedProfile;

  if (loading) {
    return <div className="p-8 text-center">Loading user session...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!profile?.onboarding_complete) {
    return <Navigate to="/onboarding" replace />;
  }

  if (role && extendedProfile?.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
