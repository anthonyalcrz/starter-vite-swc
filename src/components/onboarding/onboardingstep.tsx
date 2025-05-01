// src/components/onboarding/onboardingstep.tsx
import React from "react";
import { motion } from "framer-motion";
import WelcomeStep from "./steps/welcomestep";
import ProfileStep from "./steps/profilestep";
import BudgetStep from "./steps/budgetstep";
import SavingsStep from "./steps/savingsstep";
import CompleteStep from "./steps/completestep";
import { OnboardingStepType } from "./onboardingsteps";

interface OnboardingStepProps {
  step: OnboardingStepType;
  data: any;
  onDataChange: (updatedData: any) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  step,
  data,
  onDataChange,
  onNext,
  onBack,
  onSkip,
}) => {
  const props = {
    contentVariants,
    onNext,
    onBack,
    onSkip,
    data,
    onDataChange,
    title: step.title,
    description: step.description,
    mascotMessage: step.mascotMessage,
    mascotEmotion: step.mascotEmotion,
  };

  switch (step.type) {
    case "welcome":
      return <WelcomeStep {...props} />;
    case "profile":
      return <ProfileStep {...props} />;
    case "budget":
      return <BudgetStep {...props} />;
    case "savings":
      return <SavingsStep {...props} />;
    case "complete":
      return <CompleteStep {...props} />;
    default:
      return <div>Unknown step type: {step.type}</div>;
  }
};

export default OnboardingStep;
