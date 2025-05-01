// src/components/onboarding/steps/welcomestep.tsx
import { motion } from "framer-motion";
import React from "react";
import { CardDescription } from "@/components/ui/card";
import SavvyMascot from "../savvymascot";

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
  contentVariants: any;
  title: string;
  description: string;
  mascotMessage: string;
  mascotEmotion?: "happy" | "excited" | "thinking" | "proud";
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onNext,
  onSkip,
  contentVariants,
  title,
  description,
  mascotMessage,
  mascotEmotion = "happy",
}) => {
  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center"
    >
      <div className="mb-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-primary mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground mb-8">{description}</p>

        <SavvyMascot
          imageUrl="/savvy/savvy_waiving.png"
          emotion={mascotEmotion}
          message={mascotMessage}
          size="medium"
          animationType="bounce"
        />
      </div>

      <CardDescription className="text-lg mb-10 max-w-md">
        Grip Finances helps you budget, save, and track your finances with ease.
        Let’s set up your account in just a few steps!
      </CardDescription>
    </motion.div>
  );
};

export default WelcomeStep;
