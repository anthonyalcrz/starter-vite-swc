import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Setup Supabase and Resend clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role needed for backend queries
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: Request): Promise<Response> {
  // Get users and their weekly budget info
  const { data: users, error } = await supabase
    .from("profiles")
    .select("email, weekly_budget, spent_this_week");

  if (error) {
    console.error("Supabase error:", error);
    return new Response("Error fetching users", { status: 500 });
  }

  const emailResults = await Promise.all(
    (users ?? []).map(async (user) => {
      if (!user.email || !user.weekly_budget || user.spent_this_week == null) return;

      const percentSpent = Math.round((user.spent_this_week / user.weekly_budget) * 100);

      return resend.emails.send({
        from: "Grip Finances <notify@gripfinances.com>",
        to: user.email,
        subject: "📊 Your Weekly Budget Summary",
        html: `
          <h2>Hey from Savvy 👋</h2>
          <p>This week, you’ve spent <strong>$${user.spent_this_week.toFixed(2)}</strong> out of your weekly budget of <strong>$${user.weekly_budget.toFixed(2)}</strong>.</p>
          <p>That’s <strong>${percentSpent}%</strong> of your budget.</p>
          <p>Stay consistent, and keep saving! 💰</p>
        `
      });
    })
  );

  return new Response(`Sent ${emailResults.length} summaries.`, { status: 200 });
}
