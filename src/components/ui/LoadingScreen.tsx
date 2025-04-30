import React, { useEffect, useState } from "react";

const messages = [
  "Budgeting is self-care 💆",
  "Every dollar deserves a job 💸",
  "Let’s make saving a habit 📈",
  "Tracking expenses... almost there!",
  "Savvy is prepping your smart wallet 🐨",
];

export default function LoadingScreen() {
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    const randomTip = messages[Math.floor(Math.random() * messages.length)];
    setCurrentMessage(randomTip);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
      {/* Savvy Mascot */}
      <img
        src="/savvy/savvy_loading.svg"
        alt="Savvy loading"
        className="w-40 h-40 animate-bounce-slow mb-4"
      />

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-[#1A202C] animate-progress-bar"></div>
      </div>

      {/* Message */}
      <p className="text-muted-foreground text-base">{currentMessage}</p>

      {/* Animation Styles */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-bounce-slow {
          animation: bounce 1.6s ease-in-out infinite;
        }

        .animate-progress-bar {
          width: 100%;
          animation: progress 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
