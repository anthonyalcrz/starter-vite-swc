import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
import { useUser } from "@supabase/auth-helpers-react";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  onboarding_complete?: boolean;
  weekly_budget?: number;
  role?: string;
  created_at?: string;
}

export function useUserData() {
  const supabase = createSupabaseClient(true);
  const user = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Failed to load user profile:", error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user, supabase]);

  return { user, profile, loading };
}
