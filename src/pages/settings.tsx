import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
const supabase = createSupabaseClient(true); // or false if needed
import NavBar from "../components/navbar";
import { Button } from "../components/ui/button";
import { ROUTES } from "../routes";
import SignOutButton from "../components/auth/signoutbutton";
import PasswordChangeForm from "../components/auth/passwordchangeform";

export default function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [payFrequency, setPayFrequency] = useState("Weekly");
  const [weeklyBudget, setWeeklyBudget] = useState("");

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);

      if (userData.user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();

        if (error) {
          console.error("Failed to fetch profile:", error.message);
        } else if (profile) {
          setName(profile.full_name || "");
          setEmail(profile.email || "");
          setPayFrequency(profile.pay_frequency || "Weekly");
          setWeeklyBudget(profile.weekly_budget?.toString() || "");
        }
      }
    };

    fetchUserAndProfile();
  }, []);

  const handleSave = async () => {
    if (!user) {
      setSaveStatus("error");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: name,
        email: email,
        pay_frequency: payFrequency,
        weekly_budget: Number(weeklyBudget),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Save failed:", error.message);
      setSaveStatus("error");
    } else {
      setSaveStatus("success");
    }

    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Back to Dashboard */}
        <div>
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="text-blue-600 flex items-center gap-2 mb-6 group"
          >
            <span className="text-xl transition-transform group-hover:-translate-x-1">
              ←
            </span>
            <span className="transition-colors group-hover:underline">
              Back to Dashboard
            </span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
          {/* Dark Mode - Disabled */}
          <div className="flex items-center justify-between border p-3 px-4 rounded-md bg-muted w-fit">
            <span className="text-sm font-medium">Dark Mode</span>
            <span className="text-xs italic text-muted-foreground ml-3">
              Coming soon
            </span>
          </div>
        </div>

        {/* Save Changes Button - Moved up here */}
        <div className="flex flex-col items-end space-y-2">
          {saveStatus === "success" && (
            <p className="text-green-600 text-sm">
              Changes saved successfully!
            </p>
          )}
          {saveStatus === "error" && (
            <p className="text-red-600 text-sm">Failed to save changes.</p>
          )}
          <Button onClick={handleSave}>Save Changes</Button>
        </div>

        {/* Personal Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">
            Personal Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">
            Financial Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Frequency of paycheck
              </label>
              <select
                value={payFrequency}
                onChange={(e) => setPayFrequency(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weekly budget amount
              </label>
              <input
                type="number"
                value={weeklyBudget}
                onChange={(e) => setWeeklyBudget(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">
            Security
          </h2>
          <PasswordChangeForm />
          <div className="mt-6 flex justify-end">
            <SignOutButton />
          </div>
        </div>
      </main>
    </div>
  );
}
