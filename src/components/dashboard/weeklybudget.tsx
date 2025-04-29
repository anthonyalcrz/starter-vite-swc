import { useState } from "react";
import { Button } from "../ui/button";
import AddExpenseModal from "./addexpensemodal"; // Your Add Expense Modal
import { toast } from "sonner";

interface Expense {
  id?: string;
  name: string;
  amount: number;
  date: string;
  time?: string;
}

interface WeeklyBudgetProps {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => Promise<void>;
  loading: boolean;
}

export default function WeeklyBudget({
  expenses,
  onAddExpense,
  loading,
}: WeeklyBudgetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleSaveExpense = async (expense: Expense) => {
    try {
      await onAddExpense(expense);
      toast.success("Expense saved! 🎉");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save expense. Try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-white">Weekly Budget</h2>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          + Add Expense
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300 text-sm">
          Loading expenses...
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center text-gray-400 dark:text-gray-500 text-sm">
          No expenses added yet.
        </div>
      ) : (
        <ul className="space-y-2 text-sm">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-1"
            >
              <div className="flex flex-col">
                <span className="font-medium dark:text-white">
                  {expense.name}
                </span>
                <span className="text-gray-400 text-xs">
                  {expense.date} {expense.time ? `at ${expense.time}` : ""}
                </span>
              </div>
              <span className="font-semibold text-green-600 dark:text-green-400">
                ${expense.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Total Spent */}
      <div className="mt-6 text-right font-semibold text-gray-700 dark:text-gray-300">
        Total Spent: ${totalSpent.toFixed(2)}
      </div>

      {/* Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExpense}
      />
    </div>
  );
}
