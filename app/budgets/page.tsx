"use client";
import { useEffect,useState } from "react";
import { CategoryBudgets } from "@/components/CategoryBudgets";

export default function Budgets(){
  const [items,setItems]=useState<any[]>([]),[cats,setCats]=useState<any[]>([]),[categoryId,setCategoryId]=useState(""),[limit,setLimit]=useState("");
  async function load(){const d=await (await fetch("/api/budgets")).json();setItems(d)}
  useEffect(()=>{load();fetch("/api/categories").then(r=>r.json()).then(setCats)},[]);
  async function save(e:React.FormEvent){e.preventDefault();await fetch("/api/budgets",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({categoryId,limit:Number(limit)})});setLimit("");load()}
  return <div className="space-y-5">
    <header><h1 className="text-3xl font-black">Monthly budgets</h1><p className="text-gray-500">Set limits so you know when to slow down.</p></header>
    <form onSubmit={save} className="card p-5 grid sm:grid-cols-3 gap-3"><select className="input" required value={categoryId} onChange={e=>setCategoryId(e.target.value)}><option value="">Category</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><input className="input" required type="number" placeholder="Monthly limit (₹)" value={limit} onChange={e=>setLimit(e.target.value)}/><button className="btn btn-primary">Save budget</button></form>
    <div className="card p-5"><CategoryBudgets items={items}/></div>
  </div>
}
