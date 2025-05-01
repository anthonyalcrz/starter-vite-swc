// src/components/onboarding/steps/budgetstep.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SavvyMascot from "../savvymascot";
import { CardDescription } from "@/components/ui/card";

interface BudgetStepProps {
  data: {
    weeklyBudget?: number;
    payFrequency?: string;
    monthlyIncome?: number;
    calculatedWeeklyIncome?: number;
  };
  onDataChange: (updatedData: any) => void;
  onNext: () => void;
  onBack: () => void;
  contentVariants: any;
  title: string;
  description: string;
  mascotMessage: string;
  mascotEmotion?: "happy" | "excited" | "thinking" | "proud";
}

const BudgetStep: React.FC<BudgetStepProps> = ({
  data,
  onDataChange,
  contentVariants,
  title,
  description,
  mascotMessage,
  mascotEmotion = "excited",
}) => {
  const [localMonthlyIncome, setLocalMonthlyIncome] = useState<string>(
    data.monthlyIncome?.toString() || ""
  );

  useEffect(() => {
    if (data.monthlyIncome) {
      const weeklyIncome = Math.round(data.monthlyIncome / 4);
      onDataChange({
        ...data,
        calculatedWeeklyIncome: weeklyIncome,
      });
    }
  }, [data.monthlyIncome]);

  const handleMonthlyIncomeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setLocalMonthlyIncome(value);

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onDataChange({
        ...data,
        monthlyIncome: numValue,
      });
    }
  };

  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center"
    >
      <div className="mb-6">
        <SavvyMascot
          imageUrl="/savvy/savvy_carrying_cointransp.png"
          emotion={mascotEmotion}
          message={mascotMessage}
          size="medium"
          animationType="pulse"
        />
      </div>
      <h2 className="text-xl font-bold text-center mb-2">{title}</h2>
      <CardDescription className="mb-8 text-center max-w-md">
        {description}
      </CardDescription>

      <div className="flex flex-col space-y-6 w-full max-w-md">
        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">What's your monthly income?</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="monthlyIncome"
              type="text"
              inputMode="decimal"
              className="pl-6"
              placeholder="0.00"
              value={localMonthlyIncome}
              onChange={handleMonthlyIncomeChange}
            />
          </div>
          {data.calculatedWeeklyIncome && (
            <p className="text-sm text-muted-foreground">
              That's about ${data.calculatedWeeklyIncome} per week
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="payFrequency">How often do you get paid?</Label>
          <Select
            value={data.payFrequency || "biweekly"}
            onValueChange={(value) =>
              onDataChange({ ...data, payFrequency: value })
            }
          >
            <SelectTrigger id="payFrequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Every Two Weeks</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>How much do you want to spend each week?</Label>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              ${data.weeklyBudget || 100}
            </span>
          </div>
          <Slider
            value={[data.weeklyBudget || 100]}
            min={50}
            max={500}
            step={10}
            onValueChange={(value) =>
              onDataChange({ ...data, weeklyBudget: value[0] })
            }
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>$50</span>
            <span>$500</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetStep;
