import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  first_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export function useUserData() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);

        // Get the current user
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!currentUser) {
          setLoading(false);
          return;
        }

        setUser(currentUser);

        // Get the user's profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          // PGRST116 is the error code for no rows returned
          throw profileError;
        }

        setProfile(profileData as UserProfile);
      } catch (err: any) {
        setError(err);
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  return { user, profile, loading, error };
}
