import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { resend } from "@/lib/resend";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get all users with a defined weekly budget
    const { data: users, error: userError } = await supabase
      .from("profiles")
      .select("id, email, full_name, weekly_budget, savings_streak, best_streak")
      .neq("weekly_budget", null);

    if (userError) throw userError;

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

    for (const user of users) {
      if (!user.email) continue;

      // Get total spent this week
      const { data: expenses, error: expenseError } = await supabase
        .from("expenses")
        .select("amount, date")
        .eq("user_id", user.id)
        .gte("date", startOfWeek.toISOString());

      if (expenseError) {
        console.warn(`Could not fetch expenses for ${user.email}`);
        continue;
      }

      const totalSpent = (expenses || []).reduce((sum, e) => sum + (e.amount ?? 0), 0);
      const budget = user.weekly_budget ?? 0;
      const percentUsed = budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;

      const subject = "🧾 Your Weekly Budget Summary from Grip Finances";
      const html = `
        <p>Hi ${user.full_name || "there"},</p>

        <p>Here’s your weekly budget recap:</p>
        <ul>
          <li><strong>Weekly Budget:</strong> $${budget.toFixed(2)}</li>
          <li><strong>You Spent:</strong> $${totalSpent.toFixed(2)} (${percentUsed}%)</li>
          <li><strong>Savings Streak:</strong> ${user.savings_streak ?? 0} week(s)</li>
          <li><strong>Best Streak:</strong> ${user.best_streak ?? 0} week(s)</li>
        </ul>

        <p>Keep it up — you’re building great habits 💪</p>
        <p>— Savvy & The Grip Finances Team 🐨</p>
      `;

      await resend.emails.send({
        from: "Savvy from Grip Finances <hello@gripfinances.com>",
        to: user.email,
        subject,
        html,
      });
    }

    return res.status(200).json({ sent: users.length });
  } catch (err: any) {
    console.error("Weekly summary error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
