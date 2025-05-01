import { useEffect, useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import supabase from "@/lib/supabaseClient";
import WeeklySummary from "@/components/dashboard/weeklysummary";
import MonthlyProgress from "@/components/dashboard/monthlyprogress";
import RecurringExpenses from "@/components/dashboard/recurringexpenses";
import SavingsStreak from "@/components/dashboard/savingsstreak";

const Dashboard = () => {
  const { user } = useUserData();

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
    const fetchProfile = async () => {
      if (!user?.id) return;

      const { data: profileData, error: profileError } = await supabase
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

      if (profileError) {
        console.error("Failed to fetch profile:", profileError.message);
      }

      setProfileData(profileData ?? null);
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
      <h1 className="text-2xl font-bold mb-2">Welcome back, {profileData.full_name}!</h1>

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
        recurringExpenses={[]} // You can replace with fetched data
        onAddRecurring={async () => {}} // You can wire this in as needed
        loading={false}
      />
    </div>
  );
};

export default Dashboard;
