// src/pages/forgot-password.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import supabase from "@/lib/supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setSubmitted(true);
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
        <div className="max-w-md w-full space-y-6 text-center">
          <img
            src="/savvy/savvy_wearing_cape.png"
            alt="Savvy to the rescue"
            className="w-24 h-24 mx-auto mb-2"
          />

          <h2 className="text-xl font-bold">Don't worry, we're here to help!</h2>

          {submitted ? (
            <p className="text-muted-foreground">
              We've sent a reset link to <strong>{email}</strong>.
            </p>
          ) : (
            <form onSubmit={handleReset} className="space-y-4 text-left">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  required
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
