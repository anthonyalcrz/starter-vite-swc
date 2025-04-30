import React, { useState } from "react";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (error: any) {
      setError(error.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top header with logo */}
      <header className="w-full p-4 border-b bg-background">
        <div className="container flex justify-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            Grip Finances
          </Link>
        </div>
      </header>

      {/* Main Signup Content */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          {!success && (
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Create an Account
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Enter your email and create a password to get started
              </p>
            </CardHeader>
          )}

          <CardContent>
            {success ? (
              <div className="space-y-4 text-center py-8">
                <div className="text-6xl mx-auto flex justify-center">✉️</div>
                <h3 className="text-xl font-medium">Check your email</h3>
                <p className="text-muted-foreground">
                  We've sent a confirmation link to <strong>{email}</strong>.
                  Please check your inbox and click the link to complete your
                  registration.
                </p>
                <p className="text-sm text-muted-foreground">
                  After confirming your email, you'll be redirected to the
                  onboarding process.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {!success && (
              <div className="text-sm text-center text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            )}
            <div className="text-xs text-center text-gray-400">
              By signing up, you agree to our Terms of Service and Privacy
              Policy
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
