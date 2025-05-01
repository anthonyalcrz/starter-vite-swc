import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import supabase from "@/lib/supabaseClient";

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { flags, loading: flagsLoading } = useFeatureFlags();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);

    const { data: usersData } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, role, onboarding_complete, created_at");

    const { data: messagesData } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    setUsers(usersData || []);
    setMessages(messagesData || []);
    setLoading(false);
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  const markMessageRead = async (id: string) => {
    await supabase.from("contact_messages").update({ read: true }).eq("id", id);
    fetchAll();
  };

  const resetOnboarding = async (userId: string) => {
    await supabase
      .from("profiles")
      .update({ onboarding_complete: false })
      .eq("id", userId);
    fetchAll();
  };

  const promoteToAdmin = async (userId: string) => {
    await supabase
      .from("profiles")
      .update({ role: "admin" } as any)
      .eq("id", userId);
    fetchAll();
  };

  const toggleFlag = async (key: string, enabled: boolean) => {
    await supabase
      .from("feature_flags")
      .update({ enabled: !enabled })
      .eq("flag_key", key);
    fetchAll();
  };

  const formatName = (user: any) => {
    const first = user.first_name ?? "";
    const last = user.last_name ?? "";
    return `${first} ${last}`.trim() || "—";
  };

  return (
    <div className="min-h-screen p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {unreadCount > 0 && (
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-md text-sm font-medium text-yellow-800">
          📬 You have {unreadCount} unread contact message
          {unreadCount > 1 ? "s" : ""}.
        </div>
      )}

      <section>
        <h2 className="text-xl font-semibold mt-8 mb-2">Feedback Inbox</h2>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg border ${
                msg.read ? "bg-muted" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm font-semibold">{msg.name}</p>
                  <p className="text-xs text-muted-foreground">{msg.email}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </div>
              <p className="text-sm mb-3">{msg.message}</p>
              {!msg.read && (
                <Button size="sm" onClick={() => markMessageRead(String(msg.id))}>
                  Mark as Read
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-12 mb-2">Live User List</h2>
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
                    <td className="p-2">{formatName(u)}</td>
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
    </div>
  );
};

export default AdminDashboard;
