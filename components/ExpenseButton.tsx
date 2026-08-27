"use client";
import { useState } from "react";
import { Modal } from "./Modal";
import { AddExpense } from "./AddExpense";

export function ExpenseButton({ onDone }: { onDone:()=>void }) {
  const [open,setOpen]=useState(false);
  return <>
    <button className="btn btn-primary" onClick={()=>setOpen(true)}>+ Add expense</button>
    <Modal open={open} title="Add expense" onClose={()=>setOpen(false)}>
      <AddExpense onDone={()=>{setOpen(false);onDone();}}/>
    </Modal>
  </>;
}
