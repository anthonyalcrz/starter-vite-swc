// src/pages/reset-password.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import supabase from "@/lib/supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset! Please log in.");
      setResetComplete(true);
      setTimeout(() => navigate("/signin"), 1500);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full p-4 border-b bg-background">
        <div className="container flex justify-center">
          <h1 className="text-2xl font-bold text-primary">Grip Finances</h1>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-xl font-bold text-center">Reset Your Password</h2>

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </Button>
          </form>

          {resetComplete && (
            <p className="text-center text-muted-foreground text-sm mt-4">
              Redirecting to sign in...
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
