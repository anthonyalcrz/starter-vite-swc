// src/components/onboarding/steps/completestep.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import SavvyMascot from "../savvymascot";
import LoadingStep from "../LoadingStep";
import { createSupabaseClient } from "@/lib/createsupabaseclient";

interface CompleteStepProps {
  onNext: () => void;
  contentVariants: any;
  data?: any;
}

const CompleteStep: React.FC<CompleteStepProps> = ({
  onNext,
  contentVariants,
  data,
}) => {
  const [loading, setLoading] = useState(false);
  const [showLoadingStep, setShowLoadingStep] = useState(false);
  const supabase = createSupabaseClient(true);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user && data) {
        const profileData = {
          id: userData.user.id,
          onboarding_complete: true,
          first_name: data.firstName || "",
          last_name: data.lastName || "",
          gender: data.gender || "",
          birth_date: data.birthDate || "",
          avatar_url: data.avatar || "",
          monthly_income: data.monthlyIncome || 0,
          calculated_weekly_income: data.calculatedWeeklyIncome || 0,
          weekly_budget: data.weeklyBudget || 200,
          pay_frequency: data.payFrequency || "weekly",
          goal_name: data.goalName || "",
          goal_amount: data.goalAmount || 0,
          goal_timeframe: data.goalTimeframe || 6,
        };

        const { error } = await supabase.from("profiles").upsert(profileData);
        if (error) {
          console.error("Error saving profile:", error.message);
          return;
        }
      }

      setShowLoadingStep(true);
      setTimeout(() => onNext(), 500);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  if (showLoadingStep) {
    return <LoadingStep />;
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
