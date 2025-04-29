import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Grip Finance has completely transformed how I manage my money. The visual tracking makes it so easy to stay on budget!",
    author: "Alex Johnson",
    role: "Freelance Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    quote:
      "I've tried many budgeting apps, but Grip Finance with Savvy is the first one that's actually fun to use. I check it daily now!",
    author: "Samantha Lee",
    role: "Marketing Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha",
  },
  {
    quote:
      "The recurring expense tracker has saved me from late fees multiple times. This app pays for itself!",
    author: "Michael Torres",
    role: "Software Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
];

const TestimonialCard = ({
  quote,
  author,
  role,
  avatar,
  index,
}: {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  index: number;
}) => {
  return (
    <motion.div
      className="flex flex-col p-6 bg-white rounded-xl shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex-1">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-5 h-5 text-yellow-400 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <p className="text-gray-700 mb-4">"{quote}"</p>
      </div>
      <div className="flex items-center">
        <img
          src={avatar}
          alt={author}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialSection = () => {
  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What Our Users Say
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Join thousands of satisfied users who have transformed their
            financial habits with Grip Finance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
