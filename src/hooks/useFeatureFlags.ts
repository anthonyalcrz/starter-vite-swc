import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/createsupabaseclient";

const supabase = createSupabaseClient(true);

export function useFeatureFlags() {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlags = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("feature_flags")
        .select("flag_key, enabled");

      if (!error && data) {
        const mapped = Object.fromEntries(
          data.map((f) => [f.flag_key, f.enabled])
        );
        setFlags(mapped);
      }

      setLoading(false);
    };

    fetchFlags();
  }, []);

  return { flags, loading };
}
