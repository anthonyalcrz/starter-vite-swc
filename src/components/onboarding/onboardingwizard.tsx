// src/components/onboarding/onboardingwizard.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { onboardingSteps } from "./onboardingsteps";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
import OnboardingStep from "./onboardingstep";

const supabase = createSupabaseClient(true);

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    avatar: "",
    monthlyIncome: 0,
    calculatedWeeklyIncome: 0,
    weeklyBudget: 200,
    payFrequency: "weekly",
    goalName: "",
    goalAmount: 0,
    goalTimeframe: 6,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile?.onboarding_complete) {
            navigate("/dashboard");
            return;
          }

          if (profile) {
            setFormData({
              firstName: profile.first_name || "",
              lastName: profile.last_name || "",
              gender: profile.gender || "",
              birthDate: profile.birth_date || "",
              avatar: profile.avatar_url || "",
              monthlyIncome: profile.monthly_income || 0,
              calculatedWeeklyIncome: profile.calculated_weekly_income || 0,
              weeklyBudget: profile.weekly_budget || 200,
              payFrequency: profile.pay_frequency || "weekly",
              goalName: profile.goal_name || "",
              goalAmount: profile.goal_amount || 0,
              goalTimeframe: profile.goal_timeframe || 6,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const saveProfileProgress = async (data: typeof formData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          ...data,
        });
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleNext = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      await saveProfileProgress(formData);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: (progress: number) => ({
      width: `${progress}%`,
      transition: { duration: 0.5, ease: "easeInOut" },
    }),
  };

  const progressPercentage = (currentStep / (onboardingSteps.length - 1)) * 100;
  const step = onboardingSteps[currentStep];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Loading your journey...</p>
      </div>
    );
  }

  return (
    <div className="bg-background w-full max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              custom={progressPercentage}
              initial="initial"
              animate="animate"
              variants={progressVariants}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Start</span>
            <span>Finish</span>
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-[400px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              className="h-full"
            >
              <OnboardingStep
                step={step}
                data={formData}
                onDataChange={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
                onSkip={() => {}}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentStep < onboardingSteps.length - 1 && (
          <div className="mt-8 flex justify-between">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button onClick={handleNext}>{step.buttonText}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
