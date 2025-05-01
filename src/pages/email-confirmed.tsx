// src/pages/email-confirmed.tsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

import supabase from "@/lib/supabaseClient";

export default function EmailConfirmed() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);
  const hasFired = useRef(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setSessionValid(true);
        if (!hasFired.current) {
          fireConfetti();
          hasFired.current = true;
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <p className="text-muted-foreground">Checking your session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full p-4 border-b bg-background">
        <div className="container flex justify-center">
          <h1 className="text-2xl font-bold text-primary">Grip Finances</h1>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <img
            src="/savvy_landing_page/savvy-hero-02.png"
            alt="Savvy confirmed!"
            className="mx-auto max-w-xs"
          />

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
      </main>
    </div>
  );
}
