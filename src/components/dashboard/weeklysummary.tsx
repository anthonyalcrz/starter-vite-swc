import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

export default function WeeklySummary() {
  const user = useUserData();
  const [weeklySpend, setWeeklySpend] = useState<number>(0);
  const [weeklyBudget, setWeeklyBudget] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;

    const fetchSummary = async () => {
      setLoading(true);

      // 1. Get expenses from this week
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday start
      startOfWeek.setHours(0, 0, 0, 0);

      const { data: expensesData, error: expensesError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", startOfWeek.toISOString());

      if (expensesError) {
        console.error("Error fetching weekly expenses:", expensesError.message);
      }

      // 2. Get user's weekly budget
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("weekly_budget")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(
          "Error fetching profile weekly budget:",
          profileError.message,
        );
      }

      const totalSpent =
        expensesData?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
      const userWeeklyBudget = profileData?.weekly_budget || 0;

      setWeeklySpend(totalSpent);
      setWeeklyBudget(userWeeklyBudget);
      setLoading(false);
    };

    fetchSummary();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Weekly Summary
        </h2>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  const percentUsed =
    weeklyBudget > 0 ? Math.min((weeklySpend / weeklyBudget) * 100, 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">
        Weekly Summary
      </h2>

      {weeklyBudget > 0 ? (
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            You've spent{" "}
            <span className="font-semibold dark:text-white">
              ${weeklySpend.toFixed(2)}
            </span>{" "}
            out of your{" "}
            <span className="font-semibold dark:text-white">
              ${weeklyBudget.toFixed(2)}
            </span>{" "}
            budget this week.
          </p>

          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${percentUsed}%` }}
            />
          </div>

          <p
            className={`text-sm ${
              percentUsed > 100 ? "text-red-500" : "text-green-500"
            }`}
          >
            {percentUsed > 100
              ? "Over budget 🚨"
              : `Used ${percentUsed.toFixed(0)}% of budget`}
          </p>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">
          Set your weekly budget to start tracking!
        </p>
      )}
    </div>
  );
}
