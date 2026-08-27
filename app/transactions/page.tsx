"use client";
import { useEffect, useState } from "react";
import { ExpenseButton } from "@/components/ExpenseButton";

export default function Transactions(){
  const [items,setItems]=useState<any[]>([]),[q,setQ]=useState(""),[cat,setCat]=useState("All");
  const [cats,setCats]=useState<any[]>([]);
  async function load(){setItems(await (await fetch("/api/expenses")).json())}
  useEffect(()=>{load();fetch("/api/categories").then(r=>r.json()).then(setCats)},[]);
  const filtered=items.filter(x=>(x.note??"").toLowerCase().includes(q.toLowerCase())&&(cat==="All"||x.category.name===cat));
  return <div className="space-y-5">
    <header className="flex justify-between items-center"><div><h1 className="text-3xl font-black">Transactions</h1><p className="text-gray-500">Every rupee you've spent.</p></div><ExpenseButton onDone={load}/></header>
    <div className="card p-4 grid sm:grid-cols-2 gap-3"><input className="input" placeholder="Search notes..." value={q} onChange={e=>setQ(e.target.value)}/><select className="input" value={cat} onChange={e=>setCat(e.target.value)}><option>All</option>{cats.map(c=><option key={c.id}>{c.name}</option>)}</select></div>
    <div className="card overflow-hidden"><div className="divide-y">{filtered.map(x=><div key={x.id} className="p-4 flex justify-between gap-4"><div><p className="font-bold">{x.note||x.category.name}</p><p className="text-xs text-gray-400">{x.category.name} • {x.paymentMethod} • {new Date(x.date).toLocaleDateString()}</p></div><p className="font-black">₹{Number(x.amount).toLocaleString()}</p></div>)}{!filtered.length&&<div className="p-10 text-center text-gray-400">No transactions found.</div>}</div></div>
  </div>
}
