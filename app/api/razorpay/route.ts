import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET_KEY!,
});

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    const options = {
      amount: amount * 100, // Amount in paisa
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
  console.error("Razorpay Error:", error);
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
}
}