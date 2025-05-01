// src/types/supabase.ts

export interface Profile {
  id: string;
  email?: string;
  name?: string;

  // Identity & avatar
  avatar_url?: string;
  birth_date?: string;
  gender?: string;

  // Income & budgeting
  monthly_income?: number;
  calculated_weekly_income?: number;
  weekly_budget?: number;
  pay_frequency?: "weekly" | "biweekly" | "monthly";

  // Goals
  goal_name?: string;
  goal_amount?: number;
  goal_timeframe?: number;

  // App flags
  onboarding_complete?: boolean;
  seen_tutorial?: boolean;
  dashboard_tour_complete?: boolean;

  // Optional admin
  role?: "user" | "admin";
}
