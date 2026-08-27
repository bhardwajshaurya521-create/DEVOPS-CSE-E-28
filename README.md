# PocketWise — Student Personal Finance

A modern full-stack student pocket-money manager built with Next.js, Prisma/PostgreSQL, Tailwind CSS and Recharts.

## Features
- Monthly pocket money
- Reserved upcoming payments
- Expense tracking
- Category budgets + 70/90/100% warnings
- Safe daily spending calculation
- Spending donut chart
- Transaction search/filter
- "Can I afford this?" checker
- Responsive mobile-first UI
- PostgreSQL database schema ready for Vercel/Supabase

## Run locally

1. Install Node.js 20+.
2. Create a PostgreSQL database (Supabase is an easy option).
3. Copy `.env.example` to `.env` and set `DATABASE_URL`.
4. Run:
   ```bash
   npm install
   npx prisma db push
   npm run db:seed
   npm run dev
   ```
5. Open http://localhost:3000

## Important
This starter uses a demo user (`student@example.com`) so it can run immediately without an authentication provider. For a production/college submission, add Auth.js/Clerk/Supabase Auth and replace the demo user lookup with the logged-in user's ID.

## Vercel
Import the GitHub repository into Vercel, add `DATABASE_URL` under Project Settings → Environment Variables, then deploy. PostgreSQL can be provided by Supabase, Neon, or another managed provider.

## Suggested next upgrades
- Real authentication
- Custom category creation UI
- Edit/delete expenses
- Recurring payments
- Monthly history and reset screen
- Export CSV/PDF
- ML model for next-month expense forecasting
