import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseclient";

type FeatureFlags = Record<string, boolean>;

export function useFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlags>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlags() {
      const { data, error } = await supabase.from("feature_flags").select("*");
      if (error) {
        console.error("Failed to fetch feature flags:", error);
        return;
      }

      const mapped: FeatureFlags = {};
      for (const flag of data) {
        mapped[flag.flag_key] = flag.enabled;
      }

      setFlags(mapped);
      setLoading(false);
    }

    fetchFlags();
  }, []);

  return { flags, loading };
}
