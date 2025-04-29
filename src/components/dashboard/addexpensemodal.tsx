import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"; // ✅ Added Button import

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: {
    name: string;
    amount: number;
    date: string;
    time?: string;
  }) => Promise<void>;
  initialData?: { name: string; amount: number; date: string; time?: string };
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddExpenseModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAmount(initialData.amount.toString());
      setDate(initialData.date);
      setTime(initialData.time || "");
    } else {
      setName("");
      setAmount("");
      setDate("");
      setTime("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async () => {
    if (!name || !amount || !date) {
      setError("Please fill out Name, Amount, and Date!");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await onSave({ name, amount: Number(amount), date, time });
      toast.success("Expense saved successfully! 🎉");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save expense. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputFocus = () => setError("");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative z-10 mx-4"
          >
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {initialData ? "Edit Expense" : "Add Expense"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="Store or Item"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="Amount"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onFocus={handleInputFocus}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                onFocus={handleInputFocus}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>

            {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-gray-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Saving..." : initialData ? "Save Changes" : "Save"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
