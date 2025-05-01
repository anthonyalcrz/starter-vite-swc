import { useState, useEffect } from "react";
import { useRecurringExpenseContext } from "@/context/RecurringExpenseContext";
import ManageRecurringModal from "./managerecurringmodal";

export interface RecurringExpense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_date: string;
  category_tag?: string;
  frequency: string;
}

export default function RecurringExpenses() {
  const {
    expenses,
    loading,
    addOrUpdate,
    remove,
  } = useRecurringExpenseContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  useEffect(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    setAnimatedTotal(total);
  }, [expenses]);

  const handleSaveExpense = async (expense: RecurringExpense) => {
    await addOrUpdate(expense);
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleDeleteExpense = async (index: number) => {
    const toDelete = expenses[index];
    const confirm = window.confirm(`Delete "${toDelete.name}"?`);
    if (!confirm) return;
    await remove(toDelete.id);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">
        Recurring Expenses
      </h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : expenses.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No recurring expenses yet.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {expenses.map((exp, idx) => {
            const dueDay = parseInt(exp.due_date.replace(/\D/g, "")) || 0;
            const today = new Date();
            const daysUntil = dueDay - today.getDate();
            const highlight = daysUntil >= 0 && daysUntil <= 7;

            return (
              <li
                key={exp.id}
                className={`py-3 flex justify-between items-center text-sm ${
                  highlight ? "bg-yellow-100 rounded" : ""
                }`}
              >
                <div>
                  <div className="font-medium dark:text-white flex items-center gap-2">
                    {exp.category_tag && <span>{exp.category_tag}</span>}
                    {exp.name}
                    {highlight && (
                      <span className="text-xs bg-yellow-300 px-2 py-0.5 rounded-full">
                        🔔 Due Soon
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ${exp.amount.toFixed(2)} — Due {exp.due_date}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(idx)}
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

      <div className="flex justify-end mt-6">
        <button
          onClick={() => {
            setEditingIndex(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Add Recurring Expense
        </button>
      </div>

      {expenses.length > 0 && (
        <div className="mt-4 text-right text-sm text-gray-600 dark:text-gray-300">
          Total This Month: ${animatedTotal.toFixed(2)}
        </div>
      )}

      <ManageRecurringModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIndex(null);
        }}
        onSave={handleSaveExpense}
        initialData={
          editingIndex !== null
            ? (expenses[editingIndex] as RecurringExpense)
            : undefined
        }
      />
    </div>
  );
}
