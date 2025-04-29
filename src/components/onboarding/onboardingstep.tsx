import React from "react";
import { motion } from "framer-motion";
import WelcomeStep from "./steps/welcomestep";
import ProfileStep from "./steps/profilestep";
import BudgetStep from "./steps/budgetstep";
import SavingsStep from "./steps/savingsstep";
import CompleteStep from "./steps/completestep";

interface OnboardingStepProps {
  type: string;
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
  type,
  data,
  onDataChange,
  onNext,
  onBack,
  onSkip,
}) => {
  switch (type) {
    case "welcome":
      return (
        <WelcomeStep
          onNext={onNext}
          onSkip={onSkip}
          contentVariants={contentVariants}
        />
      );
    case "profile":
      return (
        <ProfileStep
          data={data}
          onDataChange={onDataChange}
          onNext={onNext}
          onBack={onBack}
          contentVariants={contentVariants}
        />
      );
    case "budget":
      return (
        <BudgetStep
          data={data}
          onDataChange={onDataChange}
          onNext={onNext}
          onBack={onBack}
          contentVariants={contentVariants}
        />
      );
    case "savings":
      return (
        <SavingsStep
          data={data}
          onDataChange={onDataChange}
          onNext={onNext}
          onBack={onBack}
          contentVariants={contentVariants}
        />
      );
    case "complete":
      return (
        <CompleteStep
          onNext={onNext}
          contentVariants={contentVariants}
          data={data}
        />
      );
    default:
      return <div>Unknown step type: {type}</div>;
  }
};

export default OnboardingStep;
