// api/send-weekly-summary.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server'; // Required for Edge runtime

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // NOTE: Must be secure
);

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  try {
    // Fetch all users + their weekly budgets and spending
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, weekly_budget');

    if (error) throw error;

    for (const user of profiles || []) {
      // Get total spent this week for the user
      const { data: expenses, error: expenseError } = await supabase
        .from('expenses')
        .select('amount, created_at')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (expenseError) continue;

      const totalSpent = expenses?.reduce((acc, e) => acc + e.amount, 0) || 0;
      const percentUsed = ((totalSpent / (user.weekly_budget || 1)) * 100).toFixed(0);

      const subject = '🧠 Your Weekly Grip Summary';
      const body = `
        Hi there! Here's how your week went with Grip Finances:

        - Weekly Budget: $${user.weekly_budget || 0}
        - Total Spent: $${totalSpent.toFixed(2)}
        - Budget Used: ${percentUsed}%

        Keep up the good work — or reel it in if needed 😉
        
        — Savvy & The Grip Team
      `;

      // Send email using Supabase built-in mailer
      await supabase.functions.invoke('send-email', {
        body: {
          to: user.email,
          subject,
          text: body,
        },
      });
    }

    return new NextResponse('Weekly summaries sent!', { status: 200 });
  } catch (err: any) {
    return new NextResponse(`Error: ${err.message}`, { status: 500 });
  }
}
