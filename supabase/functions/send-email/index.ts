// supabase/functions/send-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { to, subject, text } = await req.json();

  if (!to || !subject || !text) {
    return new Response("Missing required fields", { status: 400 });
  }

  // Example using Resend SMTP or a basic SMTP provider
  const apiKey = Deno.env.get("RESEND_API_KEY"); // or your SMTP key

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "hello@gripfinances.com",
      to,
      subject,
      text,
    }),
  });

  const result = await response.json();

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
    status: response.status,
  });
});
