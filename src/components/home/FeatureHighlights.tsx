import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Smart Budget Tracking",
    description:
      "Automatically categorize expenses and track your spending habits in real-time.",
    icon: "/savvy/savvy_carrying_cointransp.png",
  },
  {
    title: "Goal Setting",
    description:
      "Set financial goals and track your progress with visual indicators and celebrations.",
    icon: "/savvy/savvy_calendar.png",
  },
  {
    title: "Recurring Expense Management",
    description:
      "Never miss a bill payment with automated reminders and tracking.",
    icon: "/savvy/savvy_wearing_cape.png",
  },
  {
    title: "Personalized Insights",
    description:
      "Get tailored financial advice and tips based on your spending patterns.",
    icon: "/savvy/savvy_leaning_looking_right.png",
  },
];

const FeatureCard = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: string;
  index: number;
}) => {
  return (
    <motion.div
      className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
    >
      {/* Circle wrapper for the icon */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-6 overflow-hidden">
        <img src={icon} alt={title} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </motion.div>
  );
};

const FeatureHighlights = () => {
  return (
    <section id="features" className="w-full py-16 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Features That Make a Difference
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Discover how Grip Finance helps you take control of your financial
            future.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
