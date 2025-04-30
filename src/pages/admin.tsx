import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseclient";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { flags, loading: flagsLoading } = useFeatureFlags();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, onboarding_complete, created_at");

    if (error) {
      console.error(error.message);
      return;
    }

    setUsers(data || []);
    setLoading(false);
  };

  const resetOnboarding = async (userId: string) => {
    await supabase
      .from("profiles")
      .update({ onboarding_complete: false })
      .eq("id", userId);

    fetchUsers();
  };

  const promoteToAdmin = async (userId: string) => {
    await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", userId);

    fetchUsers();
  };

  const toggleFlag = async (key: string, enabled: boolean) => {
    await supabase
      .from("feature_flags")
      .update({ enabled: !enabled })
      .eq("flag_key", key);
  };

  return (
    <div className="min-h-screen p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* 👥 USER LIST */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Live User List</h2>
        {loading ? (
          <p className="text-muted-foreground">Loading users...</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Onboarded</th>
                  <th className="p-2">Joined</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-accent/40">
                    <td className="p-2">{u.full_name || "—"}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2">
                      {u.onboarding_complete ? "✅" : "❌"}
                    </td>
                    <td className="p-2">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-2 space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetOnboarding(u.id)}
                      >
                        Reset Onboarding
                      </Button>
                      {u.role !== "admin" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => promoteToAdmin(u.id)}
                        >
                          Promote to Admin
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 🚩 FEATURE FLAGS */}
      <section>
        <h2 className="text-xl font-semibold mt-10 mb-2">Feature Flags</h2>
        {flagsLoading ? (
          <p className="text-muted-foreground">Loading flags...</p>
        ) : (
          <div className="grid gap-4 max-w-xl">
            {Object.entries(flags).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <span className="text-sm font-medium">{key}</span>
                <Switch
                  checked={value}
                  onCheckedChange={() => toggleFlag(key, value)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🧪 SIMULATION ACTIONS */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-2">Testing Actions</h2>
        <p className="text-muted-foreground text-sm">
          Add future dev buttons here: e.g., simulate streaks, create test
          budgets, or run onboarding reset flow.
        </p>
      </section>
    </div>
  );
};

export default AdminDashboard;
