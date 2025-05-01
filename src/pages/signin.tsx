// src/pages/signin.tsx
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const supabase = createSupabaseClient(rememberMe);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setErrorMsg("Invalid email or password.");
        return;
      }

      // Wait for session to be restored
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setErrorMsg("Session could not be established. Please try again.");
        return;
      }

      // Fetch onboarding status
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", user.id)
        .single();

      if (profile?.onboarding_complete === false) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full p-4 border-b bg-background">
        <div className="container flex justify-center">
          <h1 className="text-2xl font-bold text-primary">Grip Finances</h1>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 rounded-lg p-8 shadow">
          <h2 className="text-xl font-semibold text-center">
            Sign In to Grip Finances
          </h2>

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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primary underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
