import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const b=await req.json();return NextResponse.json(await prisma.futurePayment.update({where:{id},data:{paid:Boolean(b.paid)}}))}
