import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateMoney, budgetStatus } from "@/lib/calculations";

const DEMO_EMAIL = "student@example.com";

export async function GET(){
  const user = await prisma.user.findUnique({where:{email:DEMO_EMAIL}});
  if(!user) return NextResponse.json({error:"Run prisma seed first."},{status:404});
  const now=new Date(), month=now.toISOString().slice(0,7);
  const start=new Date(now.getFullYear(),now.getMonth(),1), end=new Date(now.getFullYear(),now.getMonth()+1,1);
  const [bm,expenses,payments,budgets]=await Promise.all([
    prisma.budgetMonth.findUnique({where:{userId_month:{userId:user.id,month}}}),
    prisma.expense.findMany({where:{userId:user.id,date:{gte:start,lt:end}},include:{category:true},orderBy:{date:"desc"}}),
    prisma.futurePayment.findMany({where:{userId:user.id,paid:false,dueDate:{gte:now}},orderBy:{dueDate:"asc"}}),
    prisma.categoryBudget.findMany({where:{userId:user.id,month},include:{category:true}})
  ]);
  const pocket=Number(bm?.pocketMoney??0), spent=expenses.reduce((s,e)=>s+Number(e.amount),0), reserved=payments.reduce((s,p)=>s+Number(p.amount),0);
  const daysRemaining=Math.max(1,Math.ceil((end.getTime()-now.getTime())/86400000));
  const {available,safeDaily}=calculateMoney({pocketMoney:pocket,reserved,spent,daysRemaining});
  const byCat=new Map<string,number>(); expenses.forEach(e=>byCat.set(e.category.name,(byCat.get(e.category.name)||0)+Number(e.amount)));
  const chart=[...byCat.entries()].map(([name,value])=>({name,value}));
  const budgetRows=budgets.map(b=>({categoryId:b.categoryId,name:b.category.name,limit:Number(b.limit),spent:byCat.get(b.category.name)||0}));
  const warnings=budgetRows.filter(b=>budgetStatus(b.spent,b.limit).level!=="safe").map(b=>{
    const pct=Math.round((b.spent/b.limit)*100); return pct>=100?`❌ ${b.name} budget exceeded.`:`⚠️ You're at ${pct}% of your ${b.name} budget.`;
  });
  const avgPerDay=expenses.length?spent/Math.max(1,Math.ceil((now.getTime()-start.getTime())/86400000)):0;
  const runoutDays=avgPerDay>0?Math.floor(available/avgPerDay):null;
  return NextResponse.json({userName:user.name,pocketMoney:pocket,reserved,spent,available,safeDaily,daysRemaining,payments,budgets:budgetRows,chart,warnings,runoutDays});
}
