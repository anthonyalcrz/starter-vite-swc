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
            Grip Finance
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="space-y-6 text-gray-700">
          <p>
            Welcome to Grip Finance! By using our app, you agree to these Terms
            of Service.
          </p>

          <p>
            Grip Finance provides personal budgeting tools to help you manage
            your finances better. You are responsible for keeping your login
            information secure.
          </p>

          <p>
            We do not provide financial advice. Grip Finance is a tool for
            personal use and informational purposes only.
          </p>

          <p>
            We reserve the right to update these Terms from time to time.
            Continued use of the app after changes means you accept the new
            Terms.
          </p>

          <p>
            If you have any questions, please{" "}
            <Link to="/contact" className="text-primary underline">
              contact us
            </Link>
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
