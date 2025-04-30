import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Initialize Supabase with service role key (server-only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔐 Must be server-side only
);

// Resend email client
const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    // Get all users with weekly budget
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, weekly_budget, savings_streak, best_streak")
      .neq("weekly_budget", null);

    if (error) throw error;

    for (const user of users || []) {
      if (!user.email) continue;

      // Get this user's spending in the last 7 days
      const { data: expenses, error: expErr } = await supabase
        .from("expenses")
        .select("amount, date")
        .eq("user_id", user.id)
        .gte("date", oneWeekAgo.toISOString());

      if (expErr) continue;

      const totalSpent = (expenses || []).reduce((sum, e) => sum + (e.amount ?? 0), 0);
      const budget = user.weekly_budget ?? 0;
      const percentUsed = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

      // Send email via Resend
      await resend.emails.send({
        from: "Savvy from Grip Finances <hello@gripfinances.com>",
        to: user.email,
        subject: "📊 Your Weekly Budget Summary",
        html: `
          <p>Hi ${user.full_name || "there"},</p>
          <p>Here’s how you did this week:</p>
          <ul>
            <li><strong>Weekly Budget:</strong> $${budget.toFixed(2)}</li>
            <li><strong>You Spent:</strong> $${totalSpent.toFixed(2)} (${percentUsed}%)</li>
            <li><strong>Savings Streak:</strong> ${user.savings_streak ?? 0} weeks</li>
            <li><strong>Best Streak:</strong> ${user.best_streak ?? 0} weeks</li>
          </ul>
          <p>Keep it up! 💪</p>
        `,
      });
    }

    return res.status(200).json({ message: "Weekly summaries sent" });
  } catch (err: any) {
    console.error("Error sending weekly summaries:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
