import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import ProtectedRoute from "./components/auth/protectedroute";
import { Toaster } from "sonner"; // ✅ ADD this!

// Lazy load components
const Home = lazy(() => import("./components/home"));
const SignIn = lazy(() => import("./components/auth/signin"));
const SignUp = lazy(() => import("./components/auth/signup"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Settings = lazy(() => import("./pages/settings"));
const OnboardingWizard = lazy(
  () => import("./components/onboarding/onboardingwizard"),
);

import Terms from "@/components/legal/terms";
import Privacy from "@/components/legal/privacy";
import Contact from "@/components/legal/contact";

function App() {
  return (
    <Suspense
      fallback={
        <p className="flex items-center justify-center h-screen">Loading...</p>
      }
    >
      <>
        {/* Toast Notifications */}
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

          {/* Dashboard - Protected Routes */}
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

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />

          {/* Tempo internal routes */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>

        {/* Extra tempo-routes integration */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
