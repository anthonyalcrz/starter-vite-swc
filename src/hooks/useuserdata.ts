import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/createsupabaseclient";

const supabase = createSupabaseClient(true);

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  onboarding_complete?: boolean;
  role?: string;
  weekly_budget?: number;
  savings_goal?: number;
  savings_streak?: number;
  best_streak?: number;
  // Add more fields as needed
};

export function useUserData() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user && !error) {
        setUser(user);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileData && !profileError) {
          setProfile(profileData);
        }
      }

      setLoading(false);
    };

    getUser();
  }, []);

  return { user, profile, loading };
}
