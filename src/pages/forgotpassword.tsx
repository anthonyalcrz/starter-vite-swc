import { useState } from "react";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createSupabaseClient(true); // persist session

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://www.gripfinances.com/reset-password",
    });

    if (error) {
      setError("Could not send reset email. Please try again.");
      console.error(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-4">Reset Your Password</h1>

        {sent ? (
          <p className="text-sm text-green-600 text-center">
            ✅ Check your inbox for a password reset link.
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>
        )}

        <p className="text-sm text-center mt-6 text-muted-foreground">
          <Link to="/signin" className="text-primary underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
