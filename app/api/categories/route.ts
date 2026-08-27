import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(){const u=await prisma.user.findUnique({where:{email:"student@example.com"}});return NextResponse.json(u?await prisma.category.findMany({where:{userId:u.id},orderBy:{name:"asc"}}):[])}
export async function POST(req:Request){const u=await prisma.user.findUnique({where:{email:"student@example.com"}});const b=await req.json();if(!u)return NextResponse.json({error:"No user"},{status:404});return NextResponse.json(await prisma.category.create({data:{userId:u.id,name:b.name,icon:b.icon||"wallet"}}))}
