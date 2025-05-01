// src/App.tsx
import { Suspense, lazy, useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useRoutes,
} from "react-router-dom";
import routes from "tempo-routes";
import ProtectedRoute from "@/components/auth/protectedroute";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { createSupabaseClient } from "@/lib/createsupabaseclient";

const Home = lazy(() => import("@/components/home/home"));
const SignIn = lazy(() => import("@/components/auth/signin"));
const SignUp = lazy(() => import("@/components/auth/signup"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Settings = lazy(() => import("@/pages/settings"));
const OnboardingWizard = lazy(() =>
  import("@/components/onboarding/onboardingwizard")
);
const Terms = lazy(() => import("@/components/legal/terms"));
const Privacy = lazy(() => import("@/components/legal/privacy"));
const Contact = lazy(() => import("@/components/legal/contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AdminDashboard = lazy(() => import("@/pages/admin"));
const SavingsBeta = lazy(() => import("@/pages/savings-beta"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const EmailConfirmed = lazy(() => import("@/pages/email-confirmed"));

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { flags, loading: flagsLoading } = useFeatureFlags();
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseClient(true);
    supabase.auth.getSession().then(() => setSessionChecked(true));
  }, []);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");
    if (type === "signup" || type === "magiclink") {
      navigate("/email-confirmed");
    }

    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("type") === "signup" || searchParams.get("type") === "magiclink") {
      navigate("/email-confirmed");
    }
  }, [location, navigate]);

  if (!sessionChecked || flagsLoading) return <LoadingScreen />;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <>
        <Toaster position="top-center" richColors closeButton />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/email-confirmed" element={<EmailConfirmed />} />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingWizard />
              </ProtectedRoute>
            }
          />
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
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {flags.enable_savings_v2 && (
            <Route
              path="/savings"
              element={
                <ProtectedRoute>
                  <SavingsBeta />
                </ProtectedRoute>
              }
            />
          )}
          <Route path="*" element={<NotFound />} />
          {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
        </Routes>

        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Analytics />
      </>
    </Suspense>
  );
}

export default App;
