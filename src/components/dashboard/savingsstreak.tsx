import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseclient";
import { useUserData } from "../../hooks/useuserdata";

export default function SavingsStreak() {
  const { profile } = useUserData();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [bestWeeklySave, setBestWeeklySave] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavingsData = async () => {
      if (!profile) return;

      setLoading(true);

      const { data: expenses, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", profile.id)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching expenses:", error.message);
        setLoading(false);
        return;
      }

      if (!expenses || expenses.length === 0) {
        setLoading(false);
        return;
      }

      const weeks: Record<string, number> = {};

      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        const year = expenseDate.getFullYear();
        const week = getWeekNumber(expenseDate);
        const key = `${year}-W${week}`;

        if (!weeks[key]) {
          weeks[key] = 0;
        }
        weeks[key] += expense.amount;
      });

      const weeklyBudget = profile.weekly_budget || 0;
      const sortedWeeks = Object.keys(weeks).sort();

      let tempStreak = 0;
      let tempBest = 0;
      let tempBestSave = 0;

      sortedWeeks.forEach((weekKey) => {
        const spent = weeks[weekKey];
        if (spent <= weeklyBudget) {
          tempStreak++;
          if (tempStreak > tempBest) {
            tempBest = tempStreak;
          }
          const saved = weeklyBudget - spent;
          if (saved > tempBestSave) {
            tempBestSave = saved;
          }
        } else {
          tempStreak = 0; // Reset streak if overspent
        }
      });

      setCurrentStreak(tempStreak);
      setBestStreak(tempBest);
      setBestWeeklySave(tempBestSave);
      setLoading(false);
    };

    fetchSavingsData();
  }, [profile]);

  const getWeekNumber = (date: Date) => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full flex justify-center items-center">
        <p className="text-gray-400 text-sm">Loading savings data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-2 dark:text-white">
          Your Savings Streak
        </h2>
        {currentStreak > 0 ? (
          <p className="text-gray-600 text-sm dark:text-gray-300">
            You've saved money{" "}
            <span className="font-bold">{currentStreak} weeks in a row</span>!
            🎉
          </p>
        ) : (
          <p className="text-gray-400 text-sm">
            Save under your weekly budget to start your streak! 🌟
          </p>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Best Weekly Save:{" "}
          <span className="font-bold">${bestWeeklySave.toFixed(2)}</span>
        </p>
      </div>

      {bestStreak > 0 && (
        <div className="mt-6 p-4 rounded-md border-l-4 bg-green-100 border-green-500 shadow-sm">
          <p className="text-sm font-medium text-green-700 dark:text-green-500">
            Best Streak: <span className="text-xl">{bestStreak} weeks</span> 🌟
          </p>
        </div>
      )}
    </div>
  );
}
