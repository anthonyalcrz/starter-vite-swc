import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Terms = () => {
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
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Last updated: April 29, 2025
        </p>
        <div className="space-y-6 text-gray-700">
          <p>
            By accessing or using Grip Finances, you agree to these Terms of Service. If you do not agree, you may not use the app.
          </p>

          <p>
            Grip Finances offers personal budgeting tools intended for informational purposes only. We do not provide financial, legal, or tax advice.
          </p>

          <p>
            You are responsible for safeguarding your account credentials. Any activity under your account is your responsibility.
          </p>

          <p>
            You must be at least 13 years old to use Grip Finances. If you're under your country's legal age, parental consent may be required.
          </p>

          <p>
            We reserve the right to update these Terms. Continued use of the app after changes constitutes acceptance of those changes.
          </p>

          <p>
            If any part of these Terms is found unenforceable, the rest will remain in effect.
          </p>

          <p>
            For questions,{" "}
            <Link to="/contact" className="text-primary underline">
              contact us
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

export default Terms;
