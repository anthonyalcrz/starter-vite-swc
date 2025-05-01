// src/components/passwordchangeform.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import supabase from "@/lib/supabaseClient";

export default function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill out both fields!");
      return;
    }

    setStatus("loading");

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData?.user?.email ?? "";

      if (!userEmail) {
        toast.error("User not found.");
        setStatus("idle");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect!");
        setStatus("idle");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast.error("Failed to update password.");
        setStatus("idle");
        return;
      }

      toast.success("Password updated successfully!");
      setStatus("success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error("Unexpected error occurred.");
      setStatus("idle");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Change Password</h3>

      <div className="space-y-4">
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
          className="w-full px-3 py-2 border rounded-md"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full px-3 py-2 border rounded-md"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleChangePassword}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>

      {status === "success" && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md text-center">
          ✅ Password changed successfully!
        </div>
      )}
    </div>
  );
}
