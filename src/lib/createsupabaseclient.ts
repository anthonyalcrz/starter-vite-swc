// src/lib/createsupabaseclient.ts
import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient(remember: boolean) {
  return createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: remember ? localStorage : sessionStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );
}
