import { NextResponse } from 'next/server';
import client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'node_' });

export async function GET() {
  try {
    const metrics = await register.metrics();
    return new NextResponse(metrics, {
      headers: { 'Content-Type': register.contentType },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}