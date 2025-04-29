import { Suspense, lazy, useEffect } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import routes from "tempo-routes";
import ProtectedRoute from "@/components/auth/protectedroute";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

// ✅ Lazy load components
const Home = lazy(() => import("@/components/home/home"));
const SignIn = lazy(() => import("@/components/auth/signin"));
const SignUp = lazy(() => import("@/components/auth/signup"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Settings = lazy(() => import("@/pages/settings"));
const OnboardingWizard = lazy(() =>
  import("@/components/onboarding/onboardingwizard")
);

// ✅ Static legal pages
import Terms from "@/components/legal/terms";
import Privacy from "@/components/legal/privacy";
import Contact from "@/components/legal/contact";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle Supabase magic link/email signup redirects
    // Converts #access_token to ?access_token for React Router
    if (window.location.hash && !location.search) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get("type");

      if (type === "signup" || type === "magiclink") {
        navigate("/onboarding");
      }
    }

    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");

    if (type === "signup" || type === "magiclink") {
      navigate("/onboarding");
    }
  }, [location, navigate]);

  return (
    <Suspense
      fallback={
        <p className="flex items-center justify-center h-screen">Loading...</p>
      }
    >
      <>
        <Toaster position="top-center" richColors closeButton />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />

          {/* Onboarding */}
          <Route path="/onboarding" element={<OnboardingWizard />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />

          {/* Tempo internal routes */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>

        {/* Tempo preview routing support */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

        {/* Analytics */}
        <Analytics />
      </>
    </Suspense>
  );
}

export default App;
