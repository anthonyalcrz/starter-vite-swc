import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useUserData } from "@/hooks/useUserData";
import { motion } from "framer-motion";

export default function MonthlyProgress() {
  const [expenses, setExpenses] = useState<
    { id?: string; name: string; amount: number; date: string }[]
  >([]);
  const [monthStartMessage, setMonthStartMessage] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { user } = useUserData();

  const dailyBudgetTarget = 50; // Example: $50/day
  const today = new Date();
  const viewingYear = selectedMonth.getFullYear();
  const viewingMonth = selectedMonth.getMonth(); // 0-indexed

  useEffect(() => {
    if (user) {
      fetchMonthlyExpenses();
    }
  }, [user, selectedMonth]);

  const fetchMonthlyExpenses = async () => {
    const start = new Date(viewingYear, viewingMonth, 1).toISOString();
    const end = new Date(viewingYear, viewingMonth + 1, 0).toISOString();

    const { data, error } = await supabase
      .from("weekly_expenses")
      .select("*")
      .eq("user_id", user?.id)
      .gte("date", start)
      .lte("date", end);

    if (error) {
      console.error("Error fetching monthly expenses:", error.message);
    } else {
      setExpenses(data || []);
    }
  };

  useEffect(() => {
    if (
      today.getDate() === 1 &&
      today.getMonth() === selectedMonth.getMonth() &&
      today.getFullYear() === selectedMonth.getFullYear()
    ) {
      setMonthStartMessage(true);
      setTimeout(() => {
        setMonthStartMessage(false);
      }, 3000);
    }
  }, [selectedMonth]);

  const getDailyTotals = () => {
    const totals: { [key: number]: number } = {};

    expenses.forEach((exp) => {
      const day = new Date(exp.date).getDate();
      if (!totals[day]) {
        totals[day] = 0;
      }
      totals[day] += exp.amount;
    });

    return totals;
  };

  const dailyTotals = getDailyTotals();

  const getDayColor = (amount: number) => {
    if (amount === undefined) return "bg-gray-100"; // No spending
    if (amount <= dailyBudgetTarget) return "bg-green-200"; // Under budget
    return "bg-red-200"; // Overspent
  };

  const daysInMonth = new Date(viewingYear, viewingMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const totalGoodDays = Object.values(dailyTotals).filter(
    (amt) => amt <= dailyBudgetTarget,
  ).length;

  const goodDaysPercentage = (totalGoodDays / daysInMonth) * 100;

  const currentMonthName = selectedMonth.toLocaleDateString("en-US", {
    month: "long",
  });

  const currentYear = selectedMonth.getFullYear();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">
        Monthly Progress
      </h2>

      {/* Month Picker */}
      <div className="mb-6 flex justify-end">
        <select
          value={`${viewingYear}-${viewingMonth}`}
          onChange={(e) => {
            const [year, month] = e.target.value.split("-");
            setSelectedMonth(new Date(parseInt(year), parseInt(month), 1));
          }}
          className="text-sm border-gray-300 rounded px-2 py-1"
          aria-label="Select month"
        >
          {generatePastMonthsOptions(13)}
        </select>
      </div>

      {/* Animated Selected Month/Year Confirmation */}
      <motion.div
        key={`${currentMonthName}-${currentYear}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-6"
      >
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-4 py-1 rounded-full font-semibold">
          {currentMonthName} {currentYear}
        </span>
      </motion.div>

      {/* New Month Message */}
      {monthStartMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-yellow-600 mb-4"
        >
          🎉 New Month Started! Let's crush it! 🐨
        </motion.div>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500">
        {daysArray.map((day) => {
          const isGoodDay =
            dailyTotals[day] !== undefined &&
            dailyTotals[day] <= dailyBudgetTarget;

          return (
            <div
              key={day}
              className={`rounded-full w-8 h-8 flex items-center justify-center transition-transform duration-300 ${getDayColor(
                dailyTotals[day],
              )} ${isGoodDay ? "hover:scale-110 cursor-pointer" : ""}`}
              aria-label={`Day ${day} spending`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Summary and Progress Bar */}
      <div className="mt-6">
        <div className="text-sm text-gray-600 text-right">
          {totalGoodDays} good days / {daysInMonth} total days
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-400 h-3 transition-all duration-700"
              style={{ width: `${goodDaysPercentage.toFixed(0)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 text-right mt-1">
            {goodDaysPercentage.toFixed(0)}% Good Days This Month
          </div>
        </div>

        {/* Savvy Congrats Badge */}
        {goodDaysPercentage >= 80 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 flex items-center justify-center bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-md"
          >
            <span className="text-yellow-700 text-sm flex gap-2 items-center">
              🐨🎉 Amazing! You've crushed {goodDaysPercentage.toFixed(0)}% good
              days this month!
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper to generate month options
function generatePastMonthsOptions(pastMonths: number) {
  const today = new Date();
  const options = [];

  for (let i = 0; i < pastMonths; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    options.push(
      <option
        key={`${d.getFullYear()}-${d.getMonth()}`}
        value={`${d.getFullYear()}-${d.getMonth()}`}
      >
        {d.toLocaleString("default", { month: "long" })} {d.getFullYear()}
      </option>,
    );
  }

  return options;
}
