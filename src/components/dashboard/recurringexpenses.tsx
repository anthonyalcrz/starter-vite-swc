import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseclient";
import { useUser } from "@supabase/auth-helpers-react";
import ManageRecurringModal from "./managerecurringmodal";

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category_tag?: string;
}

export interface RecurringExpensesProps {
  recurringExpenses: RecurringExpense[];
  onAddRecurring: (newRecurring: {
    name: string;
    amount: number;
    dueDate: string;
    category_tag?: string;
  }) => Promise<void>;
  loading: boolean;
}

export default function RecurringExpenses({
  recurringExpenses,
  onAddRecurring,
  loading,
}: RecurringExpensesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const user = useUser();

  // Animate Total when recurringExpenses change
  useEffect(() => {
    const realTotal = recurringExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0,
    );

    const duration = 400;
    const frameRate = 30;
    const steps = duration / (1000 / frameRate);
    const increment = realTotal / steps;

    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= realTotal) {
        clearInterval(interval);
        setAnimatedTotal(realTotal);
      } else {
        setAnimatedTotal(current);
      }
    }, 1000 / frameRate);

    return () => clearInterval(interval);
  }, [recurringExpenses]);

  const handleSaveExpense = async (expense: {
    name: string;
    amount: number;
    dueDate: string;
    category_tag: string;
  }) => {
    if (!user) return;

    if (editingIndex !== null) {
      const toUpdate = recurringExpenses[editingIndex];
      const { error } = await supabase
        .from("recurring_expenses")
        .update({
          name: expense.name,
          amount: expense.amount,
          dueDate: expense.dueDate,
          category_tag: expense.category_tag,
        })
        .eq("id", toUpdate.id);

      if (error) {
        console.error("Error updating recurring expense:", error.message);
      } else {
        // Let parent component handle the refresh
        onAddRecurring(expense);
        setEditingIndex(null);
      }
    } else {
      // Let parent component handle the add
      onAddRecurring(expense);
    }

    setIsModalOpen(false);
  };

  const handleEditExpense = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = async (index: number) => {
    const toDelete = recurringExpenses[index];
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${toDelete.name}"?`,
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("recurring_expenses")
      .delete()
      .eq("id", toDelete.id);

    if (error) {
      console.error("Error deleting recurring expense:", error.message);
    } else {
      // Let parent component handle the refresh
      onAddRecurring({ name: "", amount: 0, dueDate: "" });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">
        Recurring Expenses
      </h2>

      {loading ? (
        <div className="text-center text-sm text-gray-500 dark:text-gray-300">
          Loading...
        </div>
      ) : recurringExpenses.length === 0 ? (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">
          No recurring expenses yet.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {recurringExpenses
            .slice()
            .sort((a, b) => {
              const catA = a.category_tag || "";
              const catB = b.category_tag || "";
              if (catA < catB) return -1;
              if (catA > catB) return 1;

              const aDue = parseInt(a.dueDate.replace(/\D/g, "")) || 0;
              const bDue = parseInt(b.dueDate.replace(/\D/g, "")) || 0;
              return aDue - bDue;
            })
            .map((exp, idx) => {
              const today = new Date();
              const currentDay = today.getDate();
              const dueDay = parseInt(exp.dueDate.replace(/\D/g, "")) || 0;
              const daysUntilDue = dueDay - currentDay;

              const highlightUpcoming = daysUntilDue >= 0 && daysUntilDue <= 7; // Due soon!

              return (
                <li
                  key={exp.id}
                  className={`py-3 flex justify-between items-center text-sm transition ${
                    highlightUpcoming ? "bg-yellow-100 rounded" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 font-medium dark:text-white">
                      {exp.category_tag && <span>{exp.category_tag}</span>}
                      {exp.name}
                      {highlightUpcoming && (
                        <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                          🔔 Due Soon
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs dark:text-gray-400">
                      ${exp.amount.toFixed(2)} — Due {exp.dueDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditExpense(idx)}
                      className="text-blue-500 hover:underline text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(idx)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      )}

      {/* Add New Recurring */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => {
            setEditingIndex(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-all"
        >
          Add Recurring Expense
        </button>
      </div>

      {/* Total Recurring Summary */}
      {recurringExpenses.length > 0 && (
        <div className="mt-6 text-right text-sm text-gray-600 dark:text-gray-300">
          Total This Month: ${animatedTotal.toFixed(2)}
        </div>
      )}

      {/* Manage Recurring Modal */}
      <ManageRecurringModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIndex(null);
        }}
        onSave={handleSaveExpense}
        initialData={
          editingIndex !== null ? recurringExpenses[editingIndex] : undefined
        }
      />
    </div>
  );
}
