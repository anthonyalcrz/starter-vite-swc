import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToFeatures = () => {
    const section = document.getElementById("features");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left column - Text and Buttons */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Take Control of Your Finances
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Track spending, set goals, and build better financial habits
                with Grip Finance and your friendly guide, Savvy.
              </p>
            </div>

            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {/* Get Started Button */}
              <Button asChild size="lg">
                <Link to="/signup">Get Started</Link>
              </Button>

              {/* Learn More Button */}
              <Button variant="outline" size="lg" onClick={scrollToFeatures}>
                Learn More
              </Button>
            </div>
          </div>

          {/* Right column - Savvy Illustration */}
          <div className="flex items-center justify-center relative">
            {/* Bottom gradient */}
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent z-0"></div>

            {/* Savvy image with motion */}
            <motion.img
              src="/savvy/savvy_excited_jumping.png"
              alt="Savvy excited"
              className="relative mx-auto w-full max-w-[400px] h-auto object-contain z-10"
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
