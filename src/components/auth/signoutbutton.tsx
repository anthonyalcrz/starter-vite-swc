// src/components/auth/signoutbutton.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabaseClient";

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Sign-out error:", error);
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSignOut} disabled={loading} className={className}>
      {loading ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
