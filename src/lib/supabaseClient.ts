// src/lib/supabaseClient.ts
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-remix";

const supabase = createBrowserSupabaseClient();

export default supabase;
