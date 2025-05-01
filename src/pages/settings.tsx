import { useEffect, useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabaseClient";

const Settings = () => {
  const { user, profile, loading, refresh } = useUserData();

  const [fullName, setFullName] = useState("");
  const [savingGoal, setSavingGoal] = useState<number | null>(null);
  const [weeklyBudget, setWeeklyBudget] = useState<number | null>(null);

  const extendedProfile = profile as typeof profile & {
    first_name?: string;
    last_name?: string;
  };

  useEffect(() => {
    if (profile) {
      const name = `${extendedProfile.first_name ?? ""} ${extendedProfile.last_name ?? ""}`.trim();
      setFullName(name);
      setSavingGoal(profile.goal_amount ?? null);
      setWeeklyBudget(profile.weekly_budget ?? null);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user?.id) return;

    const [firstName, ...lastParts] = fullName.trim().split(" ");
    const lastName = lastParts.join(" ");

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName || "",
        last_name: lastName || "",
        goal_amount: savingGoal,
        weekly_budget: weeklyBudget,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error saving profile:", error.message);
      alert("Failed to save settings. Please try again.");
    } else {
      await refresh(); // refresh the profile in memory
      alert("Settings saved successfully!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div>
          <Label htmlFor="goal">Savings Goal ($)</Label>
          <Input
            id="goal"
            type="number"
            value={savingGoal ?? ""}
            onChange={(e) => setSavingGoal(Number(e.target.value))}
            placeholder="Enter your savings goal"
          />
        </div>

        <div>
          <Label htmlFor="budget">Weekly Budget ($)</Label>
          <Input
            id="budget"
            type="number"
            value={weeklyBudget ?? ""}
            onChange={(e) => setWeeklyBudget(Number(e.target.value))}
            placeholder="Enter your weekly budget"
          />
        </div>

        <div className="pt-4">
          <Button type="button" className="w-full" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
