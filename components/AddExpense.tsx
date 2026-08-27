"use client";
import { useEffect, useState } from "react";
import { PAYMENT_METHODS } from "@/lib/constants";

export function AddExpense({ onDone }: { onDone: () => void }) {
  const [cats, setCats] = useState<any[]>([]);
  const [form, setForm] = useState({ amount:"", categoryId:"", date:new Date().toISOString().slice(0,10), paymentMethod:"UPI", note:"" });
  const [busy,setBusy]=useState(false);

  useEffect(()=>{ fetch("/api/categories").then(r=>r.json()).then(setCats); },[]);
  async function submit(e:React.FormEvent){
    e.preventDefault(); setBusy(true);
    await fetch("/api/expenses",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,amount:Number(form.amount)})});
    setBusy(false); onDone();
  }
  return <form onSubmit={submit} className="space-y-3">
    <input className="input" required type="number" min="1" placeholder="Amount (₹)" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
    <select className="input" required value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})}><option value="">Category</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
    <input className="input" required type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
    <select className="input" value={form.paymentMethod} onChange={e=>setForm({...form,paymentMethod:e.target.value})}>{PAYMENT_METHODS.map(x=><option key={x}>{x}</option>)}</select>
    <input className="input" placeholder="Note (optional)" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/>
    <button disabled={busy} className="btn btn-primary w-full">{busy?"Saving...":"Add expense"}</button>
  </form>
}
