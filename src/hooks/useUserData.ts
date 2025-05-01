import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import type { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface UseUserDataResult {
  user: {
    id: string;
    email: string;
  } | null;
  profile: Profile | null;
  loading: boolean;
}

export function useUserData(): UseUserDataResult & { refresh: () => Promise<void> } {
  const [user, setUser] = useState<UseUserDataResult["user"]>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUser({ id: user.id, email: user.email ?? "" });

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single<Profile>();

    setProfile(profile ?? null);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { user, profile, loading, refresh: fetchUserData };
}
