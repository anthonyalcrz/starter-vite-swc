// src/types/supabase.ts

export interface Profile {
  id: string;
  email?: string;

  // Basic user info
  first_name?: string;
  last_name?: string;
  gender?: string;
  birth_date?: string;
  avatar_url?: string;

  // Income & budgeting
  monthly_income?: number;
  calculated_weekly_income?: number;
  weekly_budget?: number;
  pay_frequency?: "weekly" | "biweekly" | "monthly";

  // Goals
  goal_name?: string;
  goal_amount?: number;
  goal_timeframe?: number;

  // App state
  onboarding_complete?: boolean;
  role?: "user" | "admin"; // Can be expanded in future
}
