// src/pages/email-confirmed.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
import { Button } from "@/components/ui/button";

const supabase = createSupabaseClient(true);

export default function EmailConfirmed() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setSessionValid(true);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <p className="text-muted-foreground">Checking your session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background space-y-8">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Grip Finances
      </h1>

      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">✅</div>

        <h2 className="text-xl font-bold text-gray-800">
          Your email has been confirmed!
        </h2>

        <p className="text-muted-foreground">
          {sessionValid
            ? "You're all set. Click below to begin onboarding."
            : "Please sign in to continue."}
        </p>

        {sessionValid ? (
          <Button onClick={() => navigate("/onboarding")}>
            Start Onboarding
          </Button>
        ) : (
          <Button variant="outline" onClick={() => navigate("/signin")}>
            Go to Sign In
          </Button>
        )}
      </div>
    </div>
  );
}
