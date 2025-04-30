import { Navigate, useLocation } from "react-router-dom";
import { useUserData } from "@/hooks/useuserdata";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string; // optional: only allow specific role
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { profile, loading } = useUserData();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white">
        <img
          src="/savvy/savvy_loading.svg"
          alt="Loading..."
          className="w-32 h-32 animate-bounce-slow mb-4"
        />
        <p className="text-muted-foreground text-base">Verifying access...</p>

        <style jsx>{`
          .animate-bounce-slow {
            animation: bounce 1.6s ease-in-out infinite;
          }

          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-6px);
            }
          }
        `}</style>
      </div>
    );
  }

  // Redirect if not logged in
  if (!profile) {
    return <Navigate to="/signin" replace />;
  }

  const isOnboardingRoute = location.pathname.startsWith("/onboarding");

  // Redirect to onboarding if not complete (unless already on onboarding route)
  if (!isOnboardingRoute && !profile.onboarding_complete) {
    return <Navigate to="/onboarding" replace />;
  }

  // Restrict by role if specified
  if (role && profile.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
