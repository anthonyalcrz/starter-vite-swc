// src/components/navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUserData } from "@/hooks/useUserData";
import SignOutButton from "./auth/signoutbutton";

export default function NavBar() {
  const { profile } = useUserData();
  const location = useLocation();

  const hideOnRoutes = [
    "/signin",
    "/signup",
    "/onboarding",
    "/forgot-password",
    "/reset-password",
  ];

  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }

  const getInitials = () => {
    const first = profile?.first_name?.[0] ?? "";
    const last = profile?.last_name?.[0] ?? "";
    return `${first}${last}`.toUpperCase() || "US";
  };

  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-800 shadow-sm transition-colors">
      {/* Logo section */}
      <div className="flex items-center space-x-2">
        <Link to="/">
          <img
            src="/savvy/savvy_excited_jumping.png"
            alt="Savvy mascot"
            className="h-10 w-10 object-contain"
            aria-label="Savvy the Koala Mascot"
          />
        </Link>
        <Link to="/">
          <span className="text-xl font-bold text-gray-900 dark:text-white hover:underline">
            Grip Finances
          </span>
        </Link>
      </div>

      {/* User info and logout */}
      <div className="flex items-center space-x-4">
        <Link to="/settings">
          <div className="relative">
            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
        </Link>
        <SignOutButton className="text-sm text-gray-500 hover:text-red-600 transition-colors" />
      </div>
    </nav>
  );
}
