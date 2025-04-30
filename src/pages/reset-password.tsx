import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const supabase = createSupabaseClient(true);

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center">Reset Your Password</h1>

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
    </div>
  );
}
