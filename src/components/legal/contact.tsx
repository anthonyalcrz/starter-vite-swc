// src/components/legal/Contact.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

// Setup Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-12 bg-background">
      {/* Back Button */}
      <div className="w-full max-w-6xl flex justify-start mb-6">
        <Link
          to="/"
          className="text-sm text-primary hover:underline font-medium"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Hero Image */}
      <div className="flex justify-center mb-8">
        <div className="w-40 h-40 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden p-4">
          <img
            src={
              submitted
                ? "/savvy/savvy_leaning_looking_righttransp.png"
                : "/savvy/savvy_waiving3transp.png"
            }
            alt="Savvy"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Contact Form */}
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-bold">
            {submitted ? "Thank you for contacting us!" : "Contact Us"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {submitted ? (
            <div className="text-center text-muted-foreground space-y-4">
              <p>
                We've received your message. Our support team will be in touch
                shortly!
              </p>
              <p>
                In the meantime, feel free to keep exploring Grip Finance 🚀
              </p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-center">
                We'd love to hear from you! Send us a message and we'll get back
                to you soon.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Write your message..."
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;
