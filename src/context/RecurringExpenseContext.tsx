import React, { createContext, useContext } from "react";
import { useRecurringExpenses, RecurringExpense } from "@/hooks/useRecurringExpenses";

interface RecurringExpenseContextValue {
  expenses: RecurringExpense[];
  loading: boolean;
  addOrUpdate: (e: Partial<RecurringExpense>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const RecurringExpenseContext = createContext<RecurringExpenseContextValue | null>(null);

export const RecurringExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { expenses, loading, addOrUpdate, remove, refresh } = useRecurringExpenses();

  return (
    <RecurringExpenseContext.Provider
      value={{ expenses, loading, addOrUpdate, remove, refresh }}
    >
      {children}
    </RecurringExpenseContext.Provider>
  );
};

export const useRecurringExpenseContext = () => {
  const ctx = useContext(RecurringExpenseContext);
  if (!ctx) {
    throw new Error("useRecurringExpenseContext must be used within RecurringExpenseProvider");
  }
  return ctx;
};
