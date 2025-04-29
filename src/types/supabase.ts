export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          onboarding_complete: boolean;
          weekly_budget: number | null; // ✅ Added for weekly_budget use
        };
        Insert: {
          id: string;
          email: string;
          onboarding_complete?: boolean;
          weekly_budget?: number | null;
        };
        Update: {
          id?: string;
          email?: string;
          onboarding_complete?: boolean;
          weekly_budget?: number | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
