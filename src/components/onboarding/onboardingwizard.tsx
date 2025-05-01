import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import { onboardingSteps, StepKey } from "./onboardingsteps";
import OnboardingStep from "./onboardingstep";
import { useUserData } from "@/hooks/useUserData";

const OnboardingWizard: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const { user } = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single<{
          id: string;
          email: string;
          avatar_url: string;
          first_name: string;
          last_name: string;
          gender: string;
          birth_date: string;
          dashboard_tour_seen: boolean;
          seen_tutorial: boolean;
          goal_name: string;
          goal_amount: number;
          goal_timeframe: number;
          onboarding_complete: boolean;
          pay_frequency: string;
          weekly_budget: number;
          monthly_income: number;
          calculated_weekly_income: number;
        }>();

      if (profile) {
        setFormData({
          ...formData,
          avatar: profile.avatar_url,
          birthDate: profile.birth_date,
          firstName: profile.first_name,
          lastName: profile.last_name,
          gender: profile.gender,
          weeklyBudget: profile.weekly_budget,
          payFrequency: profile.pay_frequency,
          goalName: profile.goal_name,
          goalAmount: profile.goal_amount,
          goalTimeframe: profile.goal_timeframe,
          monthlyIncome: profile.monthly_income,
          calculatedWeeklyIncome: profile.calculated_weekly_income,
        });
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleDataChange = (updated: any) => {
    setFormData((prev: any) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleNext = () => {
    setStepIndex((prev) => Math.min(prev + 1, onboardingSteps.length - 1));
  };

  const handleBack = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const currentStep = onboardingSteps[stepIndex];

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 p-6 md:p-8 rounded-lg shadow-lg">
        <OnboardingStep
          key={currentStep.type}
          stepKey={currentStep.type as StepKey}
          title={currentStep.title}
          description={currentStep.description}
          mascotMessage={currentStep.mascotMessage}
          mascotEmotion={currentStep.mascotEmotion}
          buttonText={currentStep.buttonText}
          data={formData}
          onDataChange={handleDataChange}
          onNext={handleNext}
          onBack={handleBack}
          isLastStep={stepIndex === onboardingSteps.length - 1}
        />
      </div>
    </div>
  );
};

export default OnboardingWizard;
