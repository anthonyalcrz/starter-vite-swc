import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SavingsBeta = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <img
        src="/savvy/savvy_confetti.png"
        alt="Savvy celebrates"
        className="w-32 h-32 mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">Welcome to Savings Beta!</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        You’ve unlocked early access to our next-gen savings tracker. We’re still polishing things up, but your feedback helps us shape the future.
      </p>
      <Button asChild>
        <Link to="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
};

export default SavingsBeta;
