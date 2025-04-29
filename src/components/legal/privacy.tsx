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
            Grip Finance
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-gray-700">
          <p>
            Grip Finance values your privacy. We only collect information
            necessary to provide our budgeting services.
          </p>

          <p>
            Your personal data (such as email and budget preferences) is
            securely stored. We do not sell your information to third parties.
          </p>

          <p>
            When connecting financial accounts, we use third-party services
            (like Plaid) with industry-standard encryption.
          </p>

          <p>
            You can request to delete your account and associated data anytime
            by contacting us at{" "}
            <a
              href="mailto:hello@gripfinances.com"
              className="text-primary underline"
            >
              hello@gripfinances.com
            </a>
            .
          </p>

          <p>
            This policy may be updated occasionally. We'll notify you of major
            changes.
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
            </a>{" "}
            anytime!
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
