import React, { useEffect, useState } from "react";
import NavBar from "@/components/navbar";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TutorialModal from "@/components/dashboard/tutorialmodal";

import supabase from "@/lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState<number | null>(null);
  const [goal, setGoal] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Failed to fetch user:", error.message);
        return;
      }

      if (user) {
        setUser(user);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Failed to fetch profile:", profileError.message);
          return;
        }

        setProfile(profileData);
        setBudget(profileData.weekly_budget ?? null);
        setGoal(profileData.savings_goal ?? null);
        setStreak(profileData.savings_streak ?? 0);
        setBestStreak(profileData.best_streak ?? 0);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleStartOnboarding = () => {
    navigate("/onboarding");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">
          Welcome back, {profile?.full_name || "Friend"} 👋
        </h1>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-1">
                Weekly Budget
              </h2>
              <p className="text-xl font-bold">${budget ?? 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-1">
                Savings Goal
              </h2>
              <p className="text-xl font-bold">${goal ?? 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-1">
                  Your Savings Streak
                </h2>
                <p className="text-xl font-bold">
                  {streak} week{streak === 1 ? "" : "s"}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-1">
                  Best Streak
                </h2>
                <p className="text-xl font-bold">
                  {bestStreak} week{bestStreak === 1 ? "" : "s"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button onClick={handleStartOnboarding} variant="outline">
            Revisit Onboarding
          </Button>
        </div>
      </main>

      {/* ✅ Show tutorial modal if needed */}
      <TutorialModal userId={user?.id || null} />
    </div>
  );
}
