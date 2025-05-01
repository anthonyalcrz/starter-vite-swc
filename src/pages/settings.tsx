import React, { useEffect, useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import supabase from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Navbar from "@/components/navbar";

const Settings: React.FC = () => {
  const { user, profile, loading } = useUserData();

  const [fullName, setFullName] = useState("");
  const [savingGoal, setSavingGoal] = useState<number | null>(null);
  const [weeklyBudget, setWeeklyBudget] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      const name = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim();
      setFullName(name);
      setSavingGoal(profile.goal_amount ?? null);
      setWeeklyBudget(profile.weekly_budget ?? null);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    const firstName = fullName.split(" ")[0] ?? "";
    const lastName = fullName.split(" ").slice(1).join(" ") ?? "";

    setUpdating(true);
    const { error } = await supabase.from("profiles").update({
      first_name: firstName,
      last_name: lastName,
      goal_amount: savingGoal,
      weekly_budget: weeklyBudget,
    }).eq("id", user.id);

    if (error) {
      toast.error("Failed to update profile.");
    } else {
      toast.success("Profile updated successfully!");
    }

    setUpdating(false);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium block mb-1">Full Name</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Koala"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Weekly Budget ($)</label>
            <Input
              type="number"
              inputMode="decimal"
              value={weeklyBudget ?? ""}
              onChange={(e) => setWeeklyBudget(Number(e.target.value))}
              placeholder="200"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Savings Goal ($)</label>
            <Input
              type="number"
              inputMode="decimal"
              value={savingGoal ?? ""}
              onChange={(e) => setSavingGoal(Number(e.target.value))}
              placeholder="1000"
            />
          </div>

          <Button onClick={handleSave} disabled={updating}>
            {updating ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Settings;
