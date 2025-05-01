// src/lib/supabaseClient.ts

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

const supabase = createBrowserSupabaseClient();

export default supabase;
