import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(){
  const u=await prisma.user.findUnique({where:{email:"student@example.com"}});
  if(!u)return NextResponse.json([]);
  return NextResponse.json(await prisma.expense.findMany({where:{userId:u.id},include:{category:true},orderBy:{date:"desc"}}));
}
export async function POST(req:Request){
  const u=await prisma.user.findUnique({where:{email:"student@example.com"}}); if(!u)return NextResponse.json({error:"No user"},{status:404});
  const b=await req.json();
  const row=await prisma.expense.create({data:{userId:u.id,categoryId:b.categoryId,amount:b.amount,date:new Date(b.date),paymentMethod:b.paymentMethod,note:b.note||null},include:{category:true}});
  return NextResponse.json(row);
}
