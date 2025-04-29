// src/components/onboarding/CompleteStep.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import SavvyMascot from "../savvymascot";
import LoadingStep from "../LoadingStep"; // ✅ import the new LoadingStep
import { createClient } from "@supabase/supabase-js";

interface CompleteStepProps {
  onNext: () => void;
  contentVariants: any;
  data?: any;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

const CompleteStep: React.FC<CompleteStepProps> = ({
  onNext,
  contentVariants,
  data,
}) => {
  const [loading, setLoading] = useState(false);
  const [showLoadingStep, setShowLoadingStep] = useState(false); // ✅ Track if should show LoadingStep

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user && data) {
        const profileData: any = {
          id: userData.user.id,
          onboarding_complete: true,
          ...(data.firstName && { first_name: data.firstName }),
          ...(data.lastName && { last_name: data.lastName }),
          ...(data.gender && { gender: data.gender }),
          ...(data.birthDate && {
            birth_date: data.birthDate.toISOString().split("T")[0],
          }),
          ...(data.avatar && { avatar_url: data.avatar }),
          ...(data.monthlyIncome && { monthly_income: data.monthlyIncome }),
          ...(data.calculatedWeeklyIncome && {
            calculated_weekly_income: data.calculatedWeeklyIncome,
          }),
          ...(data.weeklyBudget && { weekly_budget: data.weeklyBudget }),
          ...(data.payFrequency && { pay_frequency: data.payFrequency }),
          ...(data.goalName && { goal_name: data.goalName }),
          ...(data.goalAmount && { goal_amount: data.goalAmount }),
          ...(data.goalTimeframe && { goal_timeframe: data.goalTimeframe }),
        };

        const { error } = await supabase.from("profiles").upsert(profileData);

        if (error) {
          console.error("Error saving profile:", error.message);
          return;
        }
      }

      onNext();
      setShowLoadingStep(true); // ✅ Show the loading screen after saving
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  if (showLoadingStep) {
    return <LoadingStep />; // ✅ Show loading screen
  }

  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center"
    >
      <div className="mb-8">
        <SavvyMascot
          imageUrl="/savvy/savvy_excited2.png"
          emotion="proud"
          message="Woohoo! You're all set up and ready to go!"
          size="large"
          animationType="bounce"
        />
      </div>
      <CardDescription className="text-lg mb-8 max-w-md mx-auto">
        You've successfully set up your Grip Finance account. Your dashboard is
        ready with your personalized budget and savings goal.
      </CardDescription>
      <Button
        onClick={handleComplete}
        className="w-full max-w-md"
        disabled={loading}
      >
        {loading ? "Saving..." : "Go to Dashboard"}
      </Button>
    </motion.div>
  );
};

export default CompleteStep;
