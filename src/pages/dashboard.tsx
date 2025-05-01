import { useEffect, useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import WeeklySummary from "@/components/dashboard/weeklysummary";
import MonthlyProgress from "@/components/dashboard/monthlyprogress";
import RecurringExpenses from "@/components/dashboard/recurringexpenses";
import SavingsStreak from "@/components/dashboard/savingsstreak";
import { useRecurringExpenseContext } from "@/context/RecurringExpenseContext";
import supabase from "@/lib/supabaseClient";

const Dashboard = () => {
  const { user } = useUserData();
  const {
    expenses,
    loading: expensesLoading,
    addOrUpdate,
  } = useRecurringExpenseContext();

  const [profileData, setProfileData] = useState<{
    id: string;
    email: string;
    avatar_url: string;
    full_name: string;
    weekly_budget: number;
    savings_goal: number;
    savings_streak: number;
    best_streak: number;
    onboarding_complete: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single<{
          id: string;
          email: string;
          avatar_url: string;
          full_name: string;
          weekly_budget: number;
          savings_goal: number;
          savings_streak: number;
          best_streak: number;
          onboarding_complete: boolean;
        }>();

      if (error) {
        console.error("Failed to fetch profile:", error.message);
      }

      setProfileData(data ?? null);
      setLoading(false);
    };

    fetchProfile();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading your dashboard...
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error loading profile.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-2">
        Welcome back, {profileData.full_name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeeklySummary />
        <MonthlyProgress />
      </div>

      <SavingsStreak
        currentStreak={profileData.savings_streak}
        bestStreak={profileData.best_streak}
        goalAmount={profileData.savings_goal}
      />

      <RecurringExpenses
        recurringExpenses={expenses}
        onAddRecurring={addOrUpdate}
        loading={expensesLoading}
      />
    </div>
  );
};

export default Dashboard;
