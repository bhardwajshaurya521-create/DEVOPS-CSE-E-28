"use client";
import { useEffect,useState } from "react";
export default function Payments(){
  const [items,setItems]=useState<any[]>([]); const [form,setForm]=useState({name:"",amount:"",dueDate:"",category:"Other"});
  async function load(){setItems(await (await fetch("/api/payments")).json())}
  useEffect(()=>{load()},[]);
  async function add(e:React.FormEvent){e.preventDefault();await fetch("/api/payments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,amount:Number(form.amount)})});setForm({name:"",amount:"",dueDate:"",category:"Other"});load()}
  async function toggle(p:any){await fetch(`/api/payments/${p.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({paid:!p.paid})});load()}
  return <div className="space-y-5">
    <header><h1 className="text-3xl font-black">Upcoming payments</h1><p className="text-gray-500">Reserve money now for things you already know are coming.</p></header>
    <form onSubmit={add} className="card p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3"><input className="input" required placeholder="Payment name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input className="input" required type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/><input className="input" required type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/><button className="btn btn-primary">Reserve payment</button></form>
    <div className="grid gap-3">{items.map(p=><div className={`card p-4 flex items-center justify-between ${p.paid?"opacity-60":""}`} key={p.id}><div><p className="font-bold">{p.name}</p><p className="text-xs text-gray-400">Due {new Date(p.dueDate).toLocaleDateString()} • {p.category}</p></div><div className="flex items-center gap-4"><span className="font-black">₹{Number(p.amount).toLocaleString()}</span><button className="btn btn-soft" onClick={()=>toggle(p)}>{p.paid?"Paid":"Mark paid"}</button></div></div>)}</div>
  </div>
}
