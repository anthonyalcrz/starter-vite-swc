// src/components/onboarding/LoadingStep.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LoadingStep() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Setting up your dashboard...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return oldProgress + 2.5;
      });
    }, 100);

    const textTimeouts = [
      setTimeout(() => setStatusText("Almost there..."), 2500),
      setTimeout(() => setStatusText("Redirecting..."), 4500),
    ];

    const redirectTimeout = setTimeout(() => {
      navigate("/dashboard");
    }, 6000);

    return () => {
      clearInterval(interval);
      textTimeouts.forEach(clearTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      <img
        src="/savvy/savvy_sitting_loading.png"
        alt="Savvy Mascot Loading"
        className="w-32 h-32 animate-bounce-slow"
      />

      <div className="w-full max-w-md">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-blue-500 h-full rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        </div>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300 text-sm">
          {statusText}
        </p>
      </div>
    </div>
  );
}
