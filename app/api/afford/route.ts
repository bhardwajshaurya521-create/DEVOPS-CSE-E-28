import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req:Request){
 const {amount}=await req.json(); const u=await prisma.user.findUnique({where:{email:"student@example.com"}});
 if(!u)return NextResponse.json({error:"No user"},{status:404});
 const now=new Date(), month=now.toISOString().slice(0,7), start=new Date(now.getFullYear(),now.getMonth(),1), end=new Date(now.getFullYear(),now.getMonth()+1,1);
 const [bm,ex,payments]=await Promise.all([
  prisma.budgetMonth.findUnique({where:{userId_month:{userId:u.id,month}}}),
  prisma.expense.findMany({where:{userId:u.id,date:{gte:start,lt:end}}}),
  prisma.futurePayment.findMany({where:{userId:u.id,paid:false,dueDate:{gte:now}}})
 ]);
 const pocket=Number(bm?.pocketMoney||0),spent=ex.reduce((s,e)=>s+Number(e.amount),0),reserved=payments.reduce((s,p)=>s+Number(p.amount),0),remaining=pocket-spent-reserved;
 const ok=Number(amount)<=remaining;
 return NextResponse.json({ok,remainingAfter:Math.max(0,remaining-Number(amount)),message:ok?`You can afford ₹${Number(amount).toLocaleString()}, but it will reduce your safe balance.`:`Not recommended. You would be ₹${(Number(amount)-remaining).toLocaleString()} short after protecting upcoming payments.`});
}
