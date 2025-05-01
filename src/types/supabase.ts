export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      recurring_payments: {
        Row: {
          amount: number;
          category_tag: string | null;
          created_at: string | null;
          due_date: string | null;
          frequency: string;
          id: string;
          name: string;
          type: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          amount: number;
          category_tag?: string | null;
          created_at?: string | null;
          due_date?: string | null;
          frequency: string;
          id?: string;
          name: string;
          type?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          category_tag?: string | null;
          created_at?: string | null;
          due_date?: string | null;
          frequency?: string;
          id?: string;
          name?: string;
          type?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
