// src/components/onboarding/savvymascot.tsx

import React from "react";
import { motion } from "framer-motion";

interface SavvyMascotProps {
  message?: string;
  emotion?: "happy" | "excited" | "thinking" | "proud";
  size?: "small" | "medium" | "large";
  animate?: boolean;
  animationType?: "bounce" | "rotate" | "pulse" | "none";
  currentStep?: number;
  isInline?: boolean;
  position?: "center" | "bottom-right";
  imageUrl?: string; // ✅ NEW
}

const SavvyMascot = ({
  message = "Hi there! I'm Savvy, and I'll help you get started with Grip Finance!",
  emotion = "happy",
  size = "medium",
  animate = true,
  animationType = "bounce",
  currentStep,
  isInline = true,
  position = "center",
  imageUrl, // ✅ NEW
}: SavvyMascotProps) => {
  const sizeMap = {
    small: "w-12 h-12",
    medium: isInline ? "w-24 h-24" : "w-20 h-20",
    large: "w-32 h-32",
  };

  const mascotVariants = {
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
    rotate: {
      rotate: [-5, 5, -5],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
    none: {},
  };

  const getEmotionStyle = () => {
    switch (emotion) {
      case "excited":
        return "bg-amber-100";
      case "thinking":
        return "bg-blue-100";
      case "proud":
        return "bg-green-100";
      case "happy":
      default:
        return "bg-yellow-100";
    }
  };

  const containerClasses = isInline
    ? `flex flex-col items-center bg-white p-4 rounded-lg shadow-md ${position === "bottom-right" ? "absolute bottom-4 right-4" : ""}`
    : `flex flex-col items-center bg-white p-2 rounded-lg shadow-md max-w-xs ${position === "bottom-right" ? "absolute bottom-4 right-4" : ""}`;

  const messageClasses = isInline
    ? "mt-3 p-3 bg-blue-50 rounded-xl max-w-xs text-center text-sm"
    : "mt-2 p-2 bg-blue-50 rounded-xl max-w-[200px] text-center text-xs";

  return (
    <div className={containerClasses}>
      <motion.div
        className={`relative ${sizeMap[size]} flex items-center justify-center ${getEmotionStyle()} rounded-full overflow-hidden`}
        animate={animate ? mascotVariants[animationType] : undefined}
        variants={mascotVariants}
      >
        <img
          src={imageUrl || "/savvy/savvy_default.png"} // ✅ fallback if none passed
          alt="Savvy Mascot"
          className="object-contain w-full h-full"
        />
      </motion.div>

      {message && (
        <motion.div
          className={messageClasses}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p>{message}</p>
        </motion.div>
      )}
    </div>
  );
};

export default SavvyMascot;
