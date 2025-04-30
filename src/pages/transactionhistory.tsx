import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
const supabase = createSupabaseClient(true); // or false if not persisting
import { useUser } from "@supabase/auth-helpers-react";
import NavBar from "../components/navbar";

export default function TransactionHistory() {
  const [expenses, setExpenses] = useState<
    { id: string; name: string; amount: number; date: string; time?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(""); // Month Filter
  const [searchQuery, setSearchQuery] = useState(""); // Search Query
  const user = useUser();

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  const fetchExpenses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("weekly_expenses")
      .select("*")
      .eq("user_id", user?.id)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error.message);
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  };

  const filteredExpenses = expenses
    .filter((exp) => {
      if (!selectedMonth) return true;
      const expDate = new Date(exp.date);
      const [year, month] = selectedMonth.split("-");
      return (
        expDate.getFullYear() === parseInt(year) &&
        expDate.getMonth() === parseInt(month)
      );
    })
    .filter((exp) =>
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  // 📦 Export to CSV
  const exportToCSV = () => {
    if (filteredExpenses.length === 0) return;

    const headers = ["Date", "Name", "Amount", "Time"];
    const rows = filteredExpenses.map((exp) => [
      new Date(exp.date).toLocaleDateString(),
      exp.name,
      exp.amount.toFixed(2),
      exp.time || "-",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

        {/* Filters + Export */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-sm border-gray-300 rounded px-2 py-1 w-full md:w-auto"
          >
            <option value="">All Transactions</option>
            {generatePastMonthsOptions(13)}
          </select>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name (ex: Starbucks)"
            className="text-sm border-gray-300 rounded px-2 py-1 w-full md:w-64"
          />

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-all"
          >
            Export CSV
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading expenses...</p>
        ) : filteredExpenses.length === 0 ? (
          <p className="text-center text-gray-500">No transactions found!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-right px-4 py-2 text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">
                    Time (optional)
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {exp.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-right">
                      ${exp.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-400">
                      {exp.time || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper to generate month options dropdown
function generatePastMonthsOptions(pastMonths: number) {
  const today = new Date();
  const options = [];

  for (let i = 0; i < pastMonths; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    options.push(
      <option
        key={`${d.getFullYear()}-${d.getMonth()}`}
        value={`${d.getFullYear()}-${d.getMonth()}`}
      >
        {d.toLocaleString("default", { month: "long" })} {d.getFullYear()}
      </option>,
    );
  }

  return options;
}
