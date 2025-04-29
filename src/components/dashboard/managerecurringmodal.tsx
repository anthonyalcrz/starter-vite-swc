import { useState, useEffect } from "react";

interface ManageRecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: {
    name: string;
    amount: number;
    dueDate: string;
    category_tag: string;
  }) => void;
  initialData?: {
    name: string;
    amount: number;
    dueDate: string;
    category_tag?: string;
  };
}

export default function ManageRecurringModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ManageRecurringModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categoryTag, setCategoryTag] = useState("📄"); // Default to generic
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAmount(initialData.amount.toString());
      setDueDate(initialData.dueDate);
      setCategoryTag(initialData.category_tag || "📄");
    } else {
      setName("");
      setAmount("");
      setDueDate("");
      setCategoryTag("📄");
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!name || !amount || !dueDate) {
      setError("Please fill all required fields!");
      return;
    }
    setError(""); // Clear error if valid
    onSave({
      name,
      amount: parseFloat(amount),
      dueDate,
      category_tag: categoryTag,
    });
    onClose();
  };

  const handleInputFocus = () => {
    setError(""); // Clear error when focusing on an input field
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          {initialData ? "Edit Recurring Expense" : "Add Recurring Expense"}
        </h2>

        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={handleInputFocus}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Example: Rent, Netflix"
              aria-label="Expense name"
            />
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onFocus={handleInputFocus}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="0.00"
              aria-label="Amount"
            />
          </div>

          {/* Due Date Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date (example: 1st, 5th, 15th)
            </label>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              onFocus={handleInputFocus}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="1st, 15th, etc."
              aria-label="Due date"
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={categoryTag}
              onChange={(e) => setCategoryTag(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              aria-label="Category"
            >
              <option value="🏠">🏠 Housing / Rent</option>
              <option value="🚗">🚗 Car / Auto</option>
              <option value="💳">💳 Credit Card / Loan</option>
              <option value="📺">📺 Subscriptions (Netflix, Hulu)</option>
              <option value="📱">📱 Phone Bill</option>
              <option value="🌐">🌐 Internet</option>
              <option value="💪">💪 Gym Membership</option>
              <option value="🎵">🎵 Music (Spotify)</option>
              <option value="🛡️">🛡️ Insurance</option>
              <option value="📄">📄 Other</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

        {/* Buttons */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:underline"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            aria-label="Save Recurring Expense"
          >
            {initialData ? "Save Changes" : "Save Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}
