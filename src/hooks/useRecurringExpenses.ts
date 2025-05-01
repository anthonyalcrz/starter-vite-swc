import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useUserData } from "./useUserData";

export interface RecurringExpense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  dueDate: string;
  category_tag?: string;
}

export function useRecurringExpenses() {
  const { user } = useUserData();
  const [expenses, setExpenses] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    if (!user?.id) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("recurring_expenses")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to fetch recurring expenses:", error.message);
    }

    setExpenses(data ?? []);
    setLoading(false);
  };

  const upsertExpense = async (expense: Partial<RecurringExpense>) => {
    if (!user) return;

    if (expense.id) {
      await supabase
        .from("recurring_expenses")
        .update({
          name: expense.name,
          amount: expense.amount,
          dueDate: expense.dueDate,
          category_tag: expense.category_tag,
        })
        .eq("id", expense.id);
    } else {
      await supabase.from("recurring_expenses").insert({
        ...expense,
        user_id: user.id,
      });
    }

    await fetchExpenses();
  };

  const deleteExpense = async (id: string) => {
    await supabase.from("recurring_expenses").delete().eq("id", id);
    await fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, [user?.id]);

  return {
    expenses,
    loading,
    addOrUpdate: upsertExpense,
    remove: deleteExpense,
    refresh: fetchExpenses,
  };
}
