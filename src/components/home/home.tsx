// src/pages/home.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabaseClient"; // ✅ Singleton import

import HeroSection from "@/components/home/HeroSection";
import FeatureHighlights from "@/components/home/FeatureHighlights";
import TestimonialSection from "@/components/home/TestimonialSection";

const Home = () => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_complete")
            .eq("id", user.id)
            .single();

          if (profile?.onboarding_complete) {
            navigate("/dashboard");
          } else {
            navigate("/onboarding");
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUser();
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">Grip Finances</span>
            <img
              src="/savvy/savvy_sitting_smilingtransp.png"
              alt="Savvy"
              className="h-8 w-8 rounded-full"
            />
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/signin" className="text-sm font-medium hover:underline">
              Sign In
            </Link>
            <Button asChild variant="default" size="sm">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex flex-col items-center">
        <HeroSection />

        <div id="features">
          <FeatureHighlights />
        </div>

        <section className="py-8 px-4 md:px-8 bg-white">
          <div className="container mx-auto flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl">
              <div className="flex flex-col items-center justify-center relative">
                <motion.div
                  className="relative w-52 h-52"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src="/savvy/savvy_excited2.png"
                    alt="Savvy Excited"
                    className="w-full h-full object-cover rounded-full shadow-lg"
                  />
                  <div className="absolute -top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow">
                    Savvy
                  </div>
                </motion.div>

                <div className="mt-4 md:mt-6 bg-white p-4 rounded-xl shadow-lg text-center w-64">
                  <p className="text-gray-800 font-medium">
                    Hi there! I'm Savvy. Ready to start your journey?
                  </p>
                </div>
              </div>

              <div className="md:pl-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Meet Savvy, your budgeting best friend
                </h2>
                <p className="text-xl text-gray-600">
                  Savvy helps you track spending, set goals, and build better
                  habits — all with a smile!
                </p>
              </div>
            </div>
          </div>
        </section>

        <TestimonialSection />

        <section className="w-full py-20 bg-primary/5">
          <div className="container flex flex-col items-center text-center gap-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to Grip Your Finances?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Join thousands of users who have transformed their financial
              habits with Grip Finances.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row md:h-24 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Grip Finances</span>
            <img
              src="/savvy/savvy_default.png"
              alt="Savvy"
              className="h-6 w-6 rounded-full"
            />
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              to="/contact"
              className="text-sm text-muted-foreground hover:underline"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
