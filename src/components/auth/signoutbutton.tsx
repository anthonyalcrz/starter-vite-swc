import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { createSupabaseClient } from "@/lib/createsupabaseclient";
const supabase = createSupabaseClient(true); // or false if not persisting


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
      navigate("/login");
    } catch (error) {
      console.error("Error during sign out:", (error as Error).message);
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSignOut} disabled={loading} className={className}>
      {loading ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
