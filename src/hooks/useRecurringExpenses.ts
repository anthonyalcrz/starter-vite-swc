import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useUserData } from "./useUserData";

export interface RecurringExpense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_date: string;
  category_tag?: string;
  frequency: string;
}

export function useRecurringExpenses() {
  const { user } = useUserData();
  const [expenses, setExpenses] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    if (!user?.id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("recurring_payments") // ✅ correct table
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to fetch recurring expenses:", error.message);
      setExpenses([]);
    } else {
      setExpenses(data as RecurringExpense[]);
    }

    setLoading(false);
  };

  const upsertExpense = async (expense: Partial<RecurringExpense>) => {
    if (!user) return;

    if (expense.id) {
      await supabase
        .from("recurring_payments")
        .update({
          name: expense.name,
          amount: expense.amount,
          due_date: expense.due_date,
          category_tag: expense.category_tag,
          frequency: expense.frequency,
        })
        .eq("id", expense.id);
    } else {
      await supabase.from("recurring_payments").insert({
        ...expense,
        user_id: user.id,
      });
    }

    await fetchExpenses();
  };

  const deleteExpense = async (id: string) => {
    await supabase.from("recurring_payments").delete().eq("id", id);
    await fetchExpenses();
  };

  useEffect(() => {
    if (user?.id) {
      fetchExpenses();
    }
  }, [user?.id]);

  return {
    expenses,
    loading,
    addOrUpdate: upsertExpense,
    remove: deleteExpense,
    refresh: fetchExpenses,
  };
}
