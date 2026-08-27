import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(){
 const u=await prisma.user.findUnique({where:{email:"student@example.com"}});if(!u)return NextResponse.json([]);
 const month=new Date().toISOString().slice(0,7), rows=await prisma.categoryBudget.findMany({where:{userId:u.id,month},include:{category:true}});
 const start=new Date();start.setDate(1);start.setHours(0,0,0,0);const end=new Date(start.getFullYear(),start.getMonth()+1,1);
 const ex=await prisma.expense.findMany({where:{userId:u.id,date:{gte:start,lt:end}},include:{category:true}});
 const spent=new Map<string,number>();ex.forEach(e=>spent.set(e.category.name,(spent.get(e.category.name)||0)+Number(e.amount)));
 return NextResponse.json(rows.map(r=>({categoryId:r.categoryId,name:r.category.name,limit:Number(r.limit),spent:spent.get(r.category.name)||0})));
}
export async function POST(req:Request){const u=await prisma.user.findUnique({where:{email:"student@example.com"}});if(!u)return NextResponse.json({error:"No user"},{status:404});const b=await req.json();const month=new Date().toISOString().slice(0,7);return NextResponse.json(await prisma.categoryBudget.upsert({where:{userId_categoryId_month:{userId:u.id,categoryId:b.categoryId,month}},update:{limit:b.limit},create:{userId:u.id,categoryId:b.categoryId,month,limit:b.limit}}))}
