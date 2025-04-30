import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full p-4 border-b bg-background">
        <div className="container flex justify-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            Grip Finances
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Last updated: April 29, 2025
        </p>
        <div className="space-y-6 text-gray-700">
          <p>
            Grip Finances values your privacy. We collect only the information
            necessary to provide our budgeting tools and improve user experience.
          </p>

          <p>
            Your data (such as email, profile preferences, and budget activity)
            is stored securely. We never sell your data to third parties.
          </p>

          <p>
            We use trusted third-party services like Supabase (for authentication and storage), Vercel (hosting), and optionally Plaid (for bank connections).
          </p>

          <p>
            You may request to view, modify, or delete your personal data by emailing{" "}
            <a
              href="mailto:hello@gripfinances.com"
              className="text-primary underline"
            >
              hello@gripfinances.com
            </a>
            .
          </p>

          <p>
            By creating an account, you consent to receiving transactional and onboarding emails. You may opt out of non-essential messages anytime.
          </p>

          <p>
            Grip Finances complies with applicable data laws such as GDPR and CCPA. You must be at least 13 years old to use the app.
          </p>

          <p>
            Questions?{" "}
            <Link to="/contact" className="text-primary underline">
              Contact us
            </Link>{" "}
            or email{" "}
            <a
              href="mailto:hello@gripfinances.com"
              className="text-primary underline"
            >
              hello@gripfinances.com
            </a>
            .
          </p>
        </div>

        <div className="mt-10">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
