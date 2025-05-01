import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

const supabase = createPagesBrowserClient<Database>();

export default supabase;
