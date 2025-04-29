import { useState, useEffect } from "react";

interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  time?: string;
}

interface RecentExpensesProps {
  expenses: Expense[];
}

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    // Show only most recent 5
    setRecentExpenses(expenses.slice(0, 5));
  }, [expenses]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">
        Recent Expenses
      </h2>

      {recentExpenses.length === 0 ? (
        <p className="text-gray-400 text-sm dark:text-gray-500">
          No expenses yet. Add your first one! 🚀
        </p>
      ) : (
        <ul className="space-y-4">
          {recentExpenses.map((expense) => (
            <li key={expense.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium dark:text-white">{expense.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(expense.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  {expense.time && `at ${expense.time}`}
                </p>
              </div>
              <p className="font-semibold text-green-600 dark:text-green-400">
                -${expense.amount.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
