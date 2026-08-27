import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
const DEMO_EMAIL="student@example.com";
export async function PUT(req:Request){
  const body=await req.json();
  const user=await prisma.user.findUnique({where:{email:DEMO_EMAIL}});
  if(!user) return NextResponse.json({error:"Seed database first"},{status:404});
  const month=new Date().toISOString().slice(0,7);
  const row=await prisma.budgetMonth.upsert({where:{userId_month:{userId:user.id,month}},update:{pocketMoney:body.pocketMoney},create:{userId:user.id,month,pocketMoney:body.pocketMoney}});
  return NextResponse.json(row);
}
