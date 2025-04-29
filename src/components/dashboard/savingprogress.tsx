import { useState } from "react";
import { Progress } from "../ui/progress";
import { Calendar } from "../ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface SavingsProgressProps {
  currentSavings?: number;
  savingsGoal?: number;
  month?: string;
  dailySavings?: Record<string, number>;
}

export default function SavingsProgress({
  currentSavings = 450,
  savingsGoal = 1000,
  month = "June",
  dailySavings = {},
}: SavingsProgressProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const savingsPercentage = Math.min(
    Math.round((currentSavings / savingsGoal) * 100),
    100,
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const currentMonthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
  });

  // Mock Saving Streak (static for now)
  const savingStreakWeeks = 5; // 🔥 Example: user saved 5 weeks in a row
  const bestStreakWeeks = 7; // Example best streak

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-white">
          Savings Progress
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            className="h-8 w-8"
            aria-label="Previous Month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{currentMonthName}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            className="h-8 w-8"
            aria-label="Next Month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Two-column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {currentMonthName} Goal
            </span>
            <span className="text-sm font-medium">
              {formatCurrency(currentSavings)} / {formatCurrency(savingsGoal)}
            </span>
          </div>

          <Progress
            value={savingsPercentage}
            className="h-2 transition-all duration-500 ease-in-out"
          />

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-300">
              {savingsPercentage}% of goal
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-300">
              {formatCurrency(savingsGoal - currentSavings)} to go
            </span>
          </div>

          {/* Calendar */}
          <div className="mt-4">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(date) => date && setCurrentDate(date)}
              className="rounded-md border w-full"
              month={currentDate}
            />
          </div>

          {/* Motivational Message */}
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {savingsPercentage >= 75
                ? "You're almost there! Keep it up!"
                : savingsPercentage >= 50
                  ? "Halfway to your goal! Great progress!"
                  : savingsPercentage >= 25
                    ? "Good start on your savings goal!"
                    : "Start small and watch your savings grow!"}
            </p>
          </div>
        </div>

        {/* Right Column - Streak Panel */}
        <div className="space-y-6">
          {/* Current Saving Streak */}
          <div className="bg-green-50 border border-green-100 p-4 rounded-md text-center shadow-sm">
            <h3 className="text-md font-semibold mb-2 text-green-800">
              Your Savings Streak
            </h3>
            <p className="text-2xl font-bold text-green-700 mb-1">
              {savingStreakWeeks} weeks
            </p>
            {savingStreakWeeks >= 5 && (
              <p className="text-sm text-green-600">🔥 Hot Streak!</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Consistent saving wins!
            </p>
          </div>

          {/* Best Streak */}
          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md text-center shadow-sm">
            <h3 className="text-md font-semibold mb-2 text-yellow-800">
              Best Streak
            </h3>
            <p className="text-2xl font-bold text-yellow-700 mb-1">
              {bestStreakWeeks} weeks 🌟
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Keep pushing to beat your record!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
