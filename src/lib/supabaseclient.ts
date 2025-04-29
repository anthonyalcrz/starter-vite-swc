import { createClient } from "@supabase/supabase-js";

// Define Supabase credentials
const supabaseUrl = "https://tugqnmzrpqeqavhizkan.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Z3FubXpycHFlcWF2aGl6a2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNjQxNjQsImV4cCI6MjA2MDc0MDE2NH0.WfK9e_87ilkLlrRuncM1SmiqecWiur7yjAfsEo80_z0";

// Validate presence of credentials
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided.");
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
