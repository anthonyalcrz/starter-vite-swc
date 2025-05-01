// src/pages/signin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SignIn() {
  const navigate = useNavigate();
  const supabase = createSupabaseClient(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Invalid credentials or account not confirmed.");
    } else {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 bg-background">
      <div className="text-2xl font-bold mb-6">Grip Finances</div>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-6"
      >
        <h1 className="text-xl font-semibold text-center">Sign In to Grip Finances</h1>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-between text-sm">
          <label>
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </main>
  );
}
