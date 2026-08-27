import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(){const u=await prisma.user.findUnique({where:{email:"student@example.com"}});return NextResponse.json(u?await prisma.futurePayment.findMany({where:{userId:u.id},orderBy:{dueDate:"asc"}}):[])}
export async function POST(req:Request){const u=await prisma.user.findUnique({where:{email:"student@example.com"}});if(!u)return NextResponse.json({error:"No user"},{status:404});const b=await req.json();return NextResponse.json(await prisma.futurePayment.create({data:{userId:u.id,name:b.name,amount:b.amount,dueDate:new Date(b.dueDate),category:b.category||"Other"}}))}
