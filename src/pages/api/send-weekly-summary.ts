import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Resend client
const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: Request): Promise<Response> {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, weekly_budget, savings_streak, best_streak")
      .neq("weekly_budget", null);

    if (error) throw error;

    for (const user of users || []) {
      if (!user.email) continue;

      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", user.id)
        .gte("date", startOfWeek.toISOString());

      const totalSpent = (expenses || []).reduce((sum, e) => sum + (e.amount ?? 0), 0);
      const budget = user.weekly_budget ?? 0;
      const percentUsed = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

      const subject = "📊 Your Weekly Budget Summary";
      const html = `
        <p>Hi ${user.full_name || "there"},</p>
        <p>Here's your recap:</p>
        <ul>
          <li><strong>Budget:</strong> $${budget.toFixed(2)}</li>
          <li><strong>Spent:</strong> $${totalSpent.toFixed(2)} (${percentUsed}%)</li>
          <li><strong>Streak:</strong> ${user.savings_streak ?? 0} weeks</li>
          <li><strong>Best:</strong> ${user.best_streak ?? 0} weeks</li>
        </ul>
        <p>Keep going strong 💪</p>
      `;

      await resend.emails.send({
        from: "Savvy from Grip Finances <hello@gripfinances.com>",
        to: user.email,
        subject,
        html,
      });
    }

    return new Response("Emails sent.", { status: 200 });
  } catch (err: any) {
    console.error("Email send failed:", err.message);
    return new Response("Failed: " + err.message, { status: 500 });
  }
}
