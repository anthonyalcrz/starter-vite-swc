import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
const supabase = createSupabaseClient();
import { useUser } from "@supabase/auth-helpers-react";
import NavBar from "../components/navbar";
import WeeklyBudget from "../components/dashboard/weeklybudget";
import SavingsProgress from "../components/dashboard/savingprogress";
import RecentExpenses from "../components/dashboard/recentexpenses";
import SavvyMotivation from "../components/dashboard/savvymotivation";
import WeeklySummary from "../components/dashboard/weeklysummary";
import SavingsStreak from "../components/dashboard/savingsstreak";
import RecurringExpenses from "../components/dashboard/recurringexpenses";
import MonthlyProgress from "../components/dashboard/monthlyprogress";
import TutorialModal from "../components/dashboard/tutorialmodal";
import { useUserData } from "../hooks/useuserdata";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { profile, loading: profileLoading } = useUserData();
  const user = useUser();

  const [firstName, setFirstName] = useState("Friend");
  const [currentDate, setCurrentDate] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<any[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [loadingRecurring, setLoadingRecurring] = useState(true);
  const [liveUpdating, setLiveUpdating] = useState(false);

  useEffect(() => {
    if (profile?.first_name) {
      setFirstName(profile.first_name); // ✅ Use first_name not name
    }
  }, [profile]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  const triggerLiveBadge = () => {
    setLiveUpdating(true);
    setTimeout(() => setLiveUpdating(false), 1500);
  };

  useEffect(() => {
    if (!user) return;

    const fetchExpenses = async () => {
      setLoadingExpenses(true);
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error) setExpenses(data || []);
      setLoadingExpenses(false);
    };

    const fetchRecurring = async () => {
      setLoadingRecurring(true);
      const { data, error } = await supabase
        .from("recurring_expenses")
        .select("*")
        .eq("user_id", user.id);
      if (!error) setRecurringExpenses(data || []);
      setLoadingRecurring(false);
    };

    fetchExpenses();
    fetchRecurring();

    const expensesSub = supabase
      .channel("realtime:expenses")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expenses" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setExpenses((prev) => [payload.new, ...prev]);
          }
          if (payload.eventType === "DELETE") {
            setExpenses((prev) => prev.filter((e) => e.id !== payload.old.id));
          }
          if (payload.eventType === "UPDATE") {
            setExpenses((prev) =>
              prev.map((e) => (e.id === payload.new.id ? payload.new : e)),
            );
          }
          triggerLiveBadge();
        },
      )
      .subscribe();

    const recurringSub = supabase
      .channel("realtime:recurring_expenses")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "recurring_expenses" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setRecurringExpenses((prev) => [payload.new, ...prev]);
          }
          if (payload.eventType === "DELETE") {
            setRecurringExpenses((prev) =>
              prev.filter((r) => r.id !== payload.old.id),
            );
          }
          if (payload.eventType === "UPDATE") {
            setRecurringExpenses((prev) =>
              prev.map((r) => (r.id === payload.new.id ? payload.new : r)),
            );
          }
          triggerLiveBadge();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(expensesSub);
      supabase.removeChannel(recurringSub);
    };
  }, [user]);

  const handleAddExpense = async (newExpense: {
    name: string;
    amount: number;
    date: string;
    time?: string;
  }) => {
    if (!user) return;

    const { error } = await supabase.from("expenses").insert([
      {
        user_id: user.id,
        name: newExpense.name,
        amount: newExpense.amount,
        date: newExpense.date,
        time: newExpense.time || null,
      },
    ]);

    if (error) {
      toast.error("Failed to add expense.");
    } else {
      toast.success("Expense added successfully!");
    }
  };

  const handleAddRecurring = async (newRecurring: {
    name: string;
    amount: number;
    dueDate: string;
    category_tag?: string;
  }) => {
    if (!user) return;

    const { error } = await supabase.from("recurring_expenses").insert([
      {
        user_id: user.id,
        name: newRecurring.name,
        amount: newRecurring.amount,
        dueDate: newRecurring.dueDate,
        category_tag: newRecurring.category_tag || null,
      },
    ]);

    if (error) {
      toast.error("Failed to add recurring expense.");
    } else {
      toast.success("Recurring expense added!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <NavBar />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Greeting */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-2 md:space-y-0">
          <div className="flex items-center gap-3">
            <motion.h1
              className="text-2xl font-bold dark:text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Hi, {profileLoading ? "..." : firstName}!
            </motion.h1>

            {/* Live Badge */}
            {liveUpdating && (
              <div className="text-xs text-blue-500 animate-pulse">
                • Updating...
              </div>
            )}
          </div>

          <p className="text-gray-500 dark:text-gray-300 text-md">
            Today is {currentDate}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SavvyMotivation />
          <SavingsStreak />
        </div>

        <WeeklySummary />

        <WeeklyBudget
          expenses={expenses}
          onAddExpense={handleAddExpense}
          loading={loadingExpenses}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SavingsProgress
            currentSavings={450}
            savingsGoal={1000}
            month="April"
          />
          <RecentExpenses expenses={expenses} />
        </div>

        <RecurringExpenses
          recurringExpenses={recurringExpenses}
          onAddRecurring={handleAddRecurring}
          loading={loadingRecurring}
        />

        <MonthlyProgress />
      </main>

      <TutorialModal userId={user?.id || null} />
    </div>
  );
}
