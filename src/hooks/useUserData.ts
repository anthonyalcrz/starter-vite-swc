// src/hooks/useUserData.ts
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/supabase";

interface UseUserDataResult {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

export function useUserData(): UseUserDataResult {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseClient(true);

    const fetchData = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) {
          setUser(null);
          setProfile(null);
          return;
        }

        setUser(authData.user);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.warn("Profile fetch error:", profileError.message);
        }

        // Still allow progression even if profile doesn't exist yet
        setProfile(profileData || null);
      } catch (error) {
        console.error("Error fetching user/profile:", error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { user, profile, loading };
}
