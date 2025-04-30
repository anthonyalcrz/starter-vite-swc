import { useState, useRef, useEffect } from "react";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
import { Button } from "../ui/button";
import { toast } from "sonner";

const supabase = createSupabaseClient(true);

export default function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const successRef = useRef<HTMLDivElement>(null);

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
        console.error(signInError.message);
        toast.error("Current password is incorrect!");
        setStatus("idle");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error(updateError.message);
        toast.error("Failed to update password. Try again.");
        setStatus("idle");
        return;
      }

      await fetch("/functions/v1/send-password-change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      setStatus("success");
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unexpected error occurred.");
      setStatus("idle");
    }
  };

  useEffect(() => {
    if (status === "success" && successRef.current) {
      successRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [status]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold dark:text-white">Change Password</h3>

      <div className="space-y-4">
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
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
        <div
          ref={successRef}
          className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md text-center animate-fadeIn"
        >
          🎉 Password changed successfully! You’ll get a confirmation email too.
        </div>
      )}
    </div>
  );
}
