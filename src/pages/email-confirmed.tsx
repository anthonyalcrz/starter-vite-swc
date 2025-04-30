import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function EmailConfirmed() {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: clear any temporary auth/session state
    // or pre-load user if needed
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">✅</div>

        <h1 className="text-2xl font-bold text-gray-800">
          Your email has been confirmed!
        </h1>

        <p className="text-muted-foreground">
          You're all set. Click below to start onboarding and personalize your budget.
        </p>

        <Button onClick={() => navigate("/onboarding")}>
          Start Onboarding
        </Button>
      </div>
    </div>
  );
}
