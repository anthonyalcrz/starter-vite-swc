import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useUserData } from "@/hooks/useUserData";

export default function WeeklySummary() {
  const { user } = useUserData(); // ✅ destructure user properly
  const [weeklyExpenses, setWeeklyExpenses] = useState<number | null>(null);
  const [weeklyBudget, setWeeklyBudget] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setLoading(true);

      // Fetch weekly budget from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("weekly_budget")
        .eq("id", user.id)
        .single();

      if (profile) {
        setWeeklyBudget(profile.weekly_budget);
      }

      // Fetch expenses for the current week
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

      const { data: expenses } = await supabase
        .from("weekly_expenses")
        .select("amount")
        .eq("user_id", user.id)
        .gte("created_at", startOfWeek.toISOString());

      const total =
        expenses?.reduce((sum, exp) => sum + exp.amount, 0) ?? null;
      setWeeklyExpenses(total);

      setLoading(false);
    };

    fetchData();
  }, [user?.id]);

  const percentUsed =
    weeklyExpenses && weeklyBudget
      ? Math.min((weeklyExpenses / weeklyBudget) * 100, 100)
      : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">
        Weekly Summary
      </h2>

      {loading ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
      ) : weeklyExpenses === null || weeklyBudget === null ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          No budget data available.
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            You’ve spent{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              ${weeklyExpenses.toFixed(2)}
            </span>{" "}
            of your{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              ${weeklyBudget.toFixed(2)}
            </span>{" "}
            weekly budget.
          </p>

          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 overflow-hidden">
            <div
              className={`h-full ${
                percentUsed >= 100
                  ? "bg-red-500"
                  : percentUsed > 75
                  ? "bg-yellow-500"
                  : "bg-green-500"
              } transition-all`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>

          <p className="text-xs text-right mt-1 text-muted-foreground">
            {percentUsed.toFixed(0)}% used
          </p>
        </>
      )}
    </div>
  );
}
