// src/components/onboarding/steps/savingsstep.tsx
import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardDescription } from "@/components/ui/card";
import SavvyMascot from "../savvymascot";

interface SavingsStepProps {
  data: {
    goalName?: string;
    goalAmount?: number | string;
    goalTimeframe?: number | string;
  };
  onDataChange: (updatedData: any) => void;
  onNext: () => void;
  onBack: () => void;
  contentVariants: any;
  title: string;
  description: string;
  mascotMessage: string;
  mascotEmotion?: "happy" | "excited" | "thinking" | "proud"; // ✅ fixed
}

const SavingsStep: React.FC<SavingsStepProps> = ({
  data,
  onDataChange,
  contentVariants,
  title,
  description,
  mascotMessage,
  mascotEmotion = "excited",
}) => {
  const calculateMonthlySavings = () => {
    const amount = Number(data.goalAmount);
    const timeframe = Number(data.goalTimeframe);

    if (isNaN(amount) || isNaN(timeframe) || timeframe === 0) {
      return null;
    }

    return Math.round(amount / timeframe);
  };

  const monthlySavings = calculateMonthlySavings();

  React.useEffect(() => {
    if (monthlySavings !== null) {
      onDataChange({
        ...data,
        monthlySavings: monthlySavings,
      });
    }
  }, [monthlySavings]);

  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center"
    >
      <div className="mb-6">
        <SavvyMascot
          imageUrl="/savvy_landing_page/savvy-hero-04.png"
          emotion={mascotEmotion}
          message={mascotMessage}
          size="medium"
          animationType="bounce"
        />
      </div>
      <h2 className="text-xl font-bold text-center mb-2">{title}</h2>
      <CardDescription className="mb-8 text-center max-w-md">
        {description}
      </CardDescription>

      <div className="flex flex-col space-y-6 w-full max-w-md">
        <div className="space-y-2">
          <Label htmlFor="goalName">Goal Name</Label>
          <Input
            id="goalName"
            placeholder="Vacation, New Phone, Emergency Fund..."
            value={data.goalName || ""}
            onChange={(e) =>
              onDataChange({ ...data, goalName: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goalAmount">Target Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="goalAmount"
              type="number"
              className="pl-6"
              placeholder="1000"
              value={data.goalAmount || ""}
              onChange={(e) =>
                onDataChange({ ...data, goalAmount: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goalTimeframe">Timeframe (months)</Label>
          <Input
            id="goalTimeframe"
            type="number"
            placeholder="6"
            value={data.goalTimeframe || ""}
            onChange={(e) =>
              onDataChange({ ...data, goalTimeframe: e.target.value })
            }
          />
        </div>

        {monthlySavings !== null && (
          <div className="p-4 bg-muted rounded-md">
            <p className="font-medium">Monthly savings needed:</p>
            <p className="text-2xl font-bold">${monthlySavings}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SavingsStep;
