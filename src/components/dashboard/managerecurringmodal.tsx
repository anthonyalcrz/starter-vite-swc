import React, { useState, useEffect } from "react";
import { RecurringExpense } from "./recurringexpenses";
import { useUserData } from "@/hooks/useUserData";

interface ManageRecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: RecurringExpense) => Promise<void>;
  initialData?: RecurringExpense;
}

const ManageRecurringModal: React.FC<ManageRecurringModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { user } = useUserData();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [dueDate, setDueDate] = useState("01");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAmount(initialData.amount);
      setDueDate(initialData.due_date || "01");
      setCategory(initialData.category_tag ?? "");
    } else {
      setName("");
      setAmount(0);
      setDueDate("01");
      setCategory("");
    }
  }, [initialData, isOpen]);

  const handleSave = async () => {
    if (!user) return;

    await onSave({
      id: initialData?.id || "",
      user_id: user.id,
      name,
      amount,
      due_date: dueDate,
      category_tag: category,
      frequency: "monthly", // default or dynamic as needed
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {initialData ? "Edit Expense" : "Add Recurring Expense"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Amount ($)</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded text-sm"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Due Day</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded text-sm"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Category</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageRecurringModal;
