export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      bank_connections: {
        Row: {
          auto_sync: boolean | null;
          bank_name: string;
          connected_at: string | null;
          created_at: string | null;
          id: string;
          is_plaid: boolean | null;
          last_sync: string | null;
          user_id: string | null;
        };
        Insert: {
          auto_sync?: boolean | null;
          bank_name: string;
          connected_at?: string | null;
          created_at?: string | null;
          id?: string;
          is_plaid?: boolean | null;
          last_sync?: string | null;
          user_id?: string | null;
        };
        Update: {
          auto_sync?: boolean | null;
          bank_name?: string;
          connected_at?: string | null;
          created_at?: string | null;
          id?: string;
          is_plaid?: boolean | null;
          last_sync?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          message: string | null;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          message?: string | null;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          message?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
      email_notifications: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          message: string;
          notification_type: string;
          read: boolean | null;
          subject: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: string;
          message: string;
          notification_type: string;
          read?: boolean | null;
          subject: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          message?: string;
          notification_type?: string;
          read?: boolean | null;
          subject?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      email_queue: {
        Row: {
          body: string | null;
          created_at: string | null;
          id: string;
          status: string | null;
          subject: string | null;
          user_id: string | null;
        };
        Insert: {
          body?: string | null;
          created_at?: string | null;
          id?: string;
          status?: string | null;
          subject?: string | null;
          user_id?: string | null;
        };
        Update: {
          body?: string | null;
          created_at?: string | null;
          id?: string;
          status?: string | null;
          subject?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "email_queue_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      expenses: {
        Row: {
          amount: number | null;
          category: string | null;
          created_at: string | null;
          date: string | null;
          description: string;
          id: string;
          label: string | null;
          type: string | null;
          user_id: string;
          week: number | null;
        };
        Insert: {
          amount?: number | null;
          category?: string | null;
          created_at?: string | null;
          date?: string | null;
          description: string;
          id?: string;
          label?: string | null;
          type?: string | null;
          user_id: string;
          week?: number | null;
        };
        Update: {
          amount?: number | null;
          category?: string | null;
          created_at?: string | null;
          date?: string | null;
          description?: string;
          id?: string;
          label?: string | null;
          type?: string | null;
          user_id?: string;
          week?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      financial_goals: {
        Row: {
          amount: number;
          color: string | null;
          created_at: string | null;
          id: string;
          name: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          amount: number;
          color?: string | null;
          created_at?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          color?: string | null;
          created_at?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          completed: boolean | null;
          created_at: string;
          emoji: string | null;
          id: string;
          name: string | null;
          saved_so_far: number | null;
          status: string | null;
          target_amount: number | null;
          timeline: number;
          user_id: string | null;
        };
        Insert: {
          completed?: boolean | null;
          created_at?: string;
          emoji?: string | null;
          id?: string;
          name?: string | null;
          saved_so_far?: number | null;
          status?: string | null;
          target_amount?: number | null;
          timeline?: number;
          user_id?: string | null;
        };
        Update: {
          completed?: boolean | null;
          created_at?: string;
          emoji?: string | null;
          id?: string;
          name?: string | null;
          saved_so_far?: number | null;
          status?: string | null;
          target_amount?: number | null;
          timeline?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          birth_date: string | null;
          email: string | null;
          goal_amount: number | null;
          goal_name: string | null;
          goal_timeframe: number | null;
          id: string;
          name: string | null;
          onboarding_complete: boolean | null;
          pay_frequency: string | null;
          weekly_budget: number | null;
        };
        Insert: {
          avatar_url?: string | null;
          birth_date?: string | null;
          email?: string | null;
          goal_amount?: number | null;
          goal_name?: string | null;
          goal_timeframe?: number | null;
          id: string;
          name?: string | null;
          onboarding_complete?: boolean | null;
          pay_frequency?: string | null;
          weekly_budget?: number | null;
        };
        Update: {
          avatar_url?: string | null;
          birth_date?: string | null;
          email?: string | null;
          goal_amount?: number | null;
          goal_name?: string | null;
          goal_timeframe?: number | null;
          id?: string;
          name?: string | null;
          onboarding_complete?: boolean | null;
          pay_frequency?: string | null;
          weekly_budget?: number | null;
        };
        Relationships: [];
      };
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
      transactions: {
        Row: {
          amount: number;
          category: string | null;
          created_at: string;
          date: string | null;
          description: string | null;
          id: string;
          name: string | null;
          transaction_date: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          category?: string | null;
          created_at?: string;
          date?: string | null;
          description?: string | null;
          id?: string;
          name?: string | null;
          transaction_date?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          category?: string | null;
          created_at?: string;
          date?: string | null;
          description?: string | null;
          id?: string;
          name?: string | null;
          transaction_date?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          automatic_allocation_enabled: boolean | null;
          created_at: string | null;
          id: string;
          last_summary_sent: string | null;
          mascot: string | null;
          monthly_summary_email: boolean | null;
          monthly_summary_enabled: boolean | null;
          pay_frequency: string | null;
          selected_mascot: string | null;
          updated_at: string | null;
          user_id: string;
          walkthrough_complete: boolean | null;
        };
        Insert: {
          automatic_allocation_enabled?: boolean | null;
          created_at?: string | null;
          id?: string;
          last_summary_sent?: string | null;
          mascot?: string | null;
          monthly_summary_email?: boolean | null;
          monthly_summary_enabled?: boolean | null;
          pay_frequency?: string | null;
          selected_mascot?: string | null;
          updated_at?: string | null;
          user_id: string;
          walkthrough_complete?: boolean | null;
        };
        Update: {
          automatic_allocation_enabled?: boolean | null;
          created_at?: string | null;
          id?: string;
          last_summary_sent?: string | null;
          mascot?: string | null;
          monthly_summary_email?: boolean | null;
          monthly_summary_enabled?: boolean | null;
          pay_frequency?: string | null;
          selected_mascot?: string | null;
          updated_at?: string | null;
          user_id?: string;
          walkthrough_complete?: boolean | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          email_opt_in: boolean | null;
          full_name: string | null;
          id: string;
          image: string | null;
          mfa_enabled: boolean | null;
          name: string | null;
          onboarding_complete: boolean | null;
          token_identifier: string;
          totp_secret: string | null;
          updated_at: string | null;
          user_id: string | null;
          weekly_budget: number | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          email_opt_in?: boolean | null;
          full_name?: string | null;
          id: string;
          image?: string | null;
          mfa_enabled?: boolean | null;
          name?: string | null;
          onboarding_complete?: boolean | null;
          token_identifier: string;
          totp_secret?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          weekly_budget?: number | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          email_opt_in?: boolean | null;
          full_name?: string | null;
          id?: string;
          image?: string | null;
          mfa_enabled?: boolean | null;
          name?: string | null;
          onboarding_complete?: boolean | null;
          token_identifier?: string;
          totp_secret?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          weekly_budget?: number | null;
        };
        Relationships: [];
      };
      weekly_expenses: {
        Row: {
          amount: number | null;
          date: string | null;
          id: string;
          name: string | null;
          time: string | null;
          user_id: string;
        };
        Insert: {
          amount?: number | null;
          date?: string | null;
          id?: string;
          name?: string | null;
          time?: string | null;
          user_id?: string;
        };
        Update: {
          amount?: number | null;
          date?: string | null;
          id?: string;
          name?: string | null;
          time?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
