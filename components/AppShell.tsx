"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, CalendarClock, PieChart, WalletCards } from "lucide-react";

const nav = [
  ["/", "Dashboard", Home],
  ["/transactions", "Transactions", Receipt],
  ["/payments", "Upcoming", CalendarClock],
  ["/budgets", "Budgets", PieChart],
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden md:flex w-64 p-5 flex-col gap-8">
        <Link href="/" className="flex items-center gap-2 font-black text-xl">
          <WalletCards size={24}/> PocketWise
        </Link>
        <nav className="space-y-2">
          {nav.map(([href, label, Icon]) => {
            const I = Icon as any;
            const active = pathname === href;
            return <Link key={href as string} href={href as string}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl font-semibold ${active ? "bg-white shadow-sm" : "text-gray-500 hover:bg-white"}`}>
              <I size={19}/>{label as string}
            </Link>
          })}
        </nav>
        <div className="mt-auto text-xs text-gray-400">Built for students • ₹</div>
      </aside>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 pb-24 md:pb-8">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t p-2 flex justify-around z-20">
        {nav.map(([href, label, Icon]) => {
          const I = Icon as any;
          return <Link key={href as string} href={href as string} className="text-xs flex flex-col items-center gap-1 p-2 text-gray-600">
            <I size={20}/>{label as string}
          </Link>
        })}
      </nav>
    </div>
  );
}
