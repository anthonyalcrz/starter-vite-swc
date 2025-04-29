import { motion } from "framer-motion";
import React from "react";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import SavvyMascot from "../savvymascot";

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
  contentVariants: any;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onNext,
  onSkip,
  contentVariants,
}) => {
  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center"
    >
      <div className="mb-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Welcome to Grip Finance
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Take control of your money with confidence
        </p>

        {/* Updated SavvyMascot with specific onboarding image */}
        <SavvyMascot
          imageUrl="/savvy/savvy_waiving.png"
          emotion="happy"
          message="Hi there! I'm Savvy, and I'm here to help you get started with Grip Finance!"
          size="medium"
          animationType="bounce"
        />
      </div>

      <CardDescription className="text-lg mb-10 max-w-md">
        Grip Finance helps you budget, save, and track your finances with ease.
        Let's set up your account in just a few steps!
      </CardDescription>

      {/* Navigation buttons are handled by OnboardingWizard */}
    </motion.div>
  );
};

export default WelcomeStep;
