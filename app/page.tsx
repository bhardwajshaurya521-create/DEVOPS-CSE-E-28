"use client";

import FinancialChatbot from '@/components/FinancialChatbot';
import { useEffect, useState } from "react";
import PaymentButton from '@/components/PaymentButton';
import { ExpenseButton } from "@/components/ExpenseButton";
import { StatCard } from "@/components/StatCard";
import { SpendingChart } from "@/components/SpendingChart";
import { CategoryBudgets } from "@/components/CategoryBudgets";
import { Wallet, LockKeyhole, TrendingDown, Clock3 } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pocketInput, setPocketInput] = useState("");

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json?.pocketMoney) {
          setPocketInput(String(json.pocketMoney));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function savePocket() {
    await fetch("/api/month", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pocketMoney: Number(pocketInput) || 0 }),
    });
    load();
  }

  if (loading || !data) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500 font-medium">
        Loading your money dashboard...
      </div>
    );
  }

  const d = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <p className="text-gray-500 text-sm">This month</p>
          <h1 className="text-3xl md:text-4xl font-black">
            Hey, {d?.user?.name || "Student"} 👋
          </h1>
        </div>
        <ExpenseButton onDone={load} />
      </div>

      <div className="card p-5 flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-bold">Monthly pocket money</label>
          <input
            className="input mt-2"
            type="number"
            value={pocketInput}
            onChange={(e) => setPocketInput(e.target.value)}
            placeholder="e.g. 5000"
          />
        </div>
        <button className="btn btn-primary" onClick={savePocket}>
          Update amount
        </button>
        <PaymentButton amount={Number(pocketInput) || 0} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Pocket money"
          value={`₹${(d?.pocketMoney ?? 0).toLocaleString()}`}
          icon={<Wallet size={19} />}
        />
        <StatCard
          label="Reserved"
          value={`₹${(d?.reserved ?? 0).toLocaleString()}`}
          hint="Unpaid upcoming payments"
          icon={<LockKeyhole size={19} />}
        />
        <StatCard
          label="Spent"
          value={`₹${(d?.spent ?? 0).toLocaleString()}`}
          icon={<TrendingDown size={19} />}
        />
        <StatCard
          label="Money remaining"
          value={`₹${(d?.available ?? 0).toLocaleString()}`}
          hint={`${d?.daysRemaining ?? 0} days left`}
          icon={<Wallet size={19} />}
        />
      </div>

      <div className="card p-5 bg-black text-white">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Clock3 size={17} /> Smart daily limit
        </div>
        <div className="text-4xl font-black mt-2">
          ₹{Math.round(d?.safeDaily ?? 0).toLocaleString()}
        </div>
        <p className="text-white/70 mt-1">
          Safe to spend today if you want your money to last.
        </p>
        {d?.runoutDays != null && d.runoutDays < (d?.daysRemaining ?? 0) && (
          <p className="mt-4 text-sm bg-white/10 rounded-xl p-3">
            ⚠️ At current pace, money may run out in {d.runoutDays} days.
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="font-black text-lg mb-4">Spending breakdown</h2>
          <SpendingChart data={d?.expensesByCategory ?? []} />
        </div>
        <div className="card p-5">
          <h2 className="font-black text-lg mb-5">Category budgets</h2>
          <CategoryBudgets items={d?.budgets ?? []} />
        </div>
        <FinancialChatbot />
      </div>
    </div>
  );
}