import { useEffect, useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import supabase from "@/lib/supabaseClient";

export default function Settings() {
  const { user, profile } = useUserData();
  const [fullName, setFullName] = useState("");
  const [savingGoal, setSavingGoal] = useState<number | null>(null);
  const [weeklyBudget, setWeeklyBudget] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setSavingGoal(profile.savings_goal || null);
      setWeeklyBudget(profile.weekly_budget || null);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user?.id) return;

    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        savings_goal: savingGoal,
        weekly_budget: weeklyBudget,
      })
      .eq("id", user.id);

    if (error) {
      console.error(error.message);
      toast.error("Failed to save changes.");
    } else {
      toast.success("Settings updated!");
    }

    setLoading(false);
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid gap-6 max-w-xl">
        <div>
          <label className="text-sm font-medium block mb-1">Full Name</label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            Weekly Budget ($)
          </label>
          <Input
            type="number"
            value={weeklyBudget ?? ""}
            onChange={(e) => setWeeklyBudget(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            Savings Goal ($)
          </label>
          <Input
            type="number"
            value={savingGoal ?? ""}
            onChange={(e) => setSavingGoal(Number(e.target.value))}
          />
        </div>

        {/* 🌓 Dark Mode Placeholder */}
        <div className="flex items-center justify-between border p-3 px-4 rounded-md bg-muted w-fit">
          <span className="text-sm font-medium">Dark Mode</span>
          <span className="text-xs italic text-muted-foreground ml-3">
            Coming soon
          </span>
        </div>

        <div className="pt-2">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
