import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createSupabaseClient(rememberMe);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error.message);
      setErrorMsg("Invalid email or password.");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 rounded-lg p-8 shadow">
        <h1 className="text-2xl font-bold text-center">Sign In to Grip Finances</h1>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm text-primary underline">
              Forgot Password?
            </Link>
          </div>

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
