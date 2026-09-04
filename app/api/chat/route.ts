import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import prisma from '@/lib/prisma';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let expenses = [];
    try {
      // Safely attempt to fetch expenses if the model exists
      const dbAny = prisma as any;
      const model = dbAny.expense || dbAny.Expense || dbAny.expenses;
      if (model && typeof model.findMany === 'function') {
        expenses = await model.findMany();
      }
    } catch (dbErr) {
      console.log('Skipping database context due to schema mismatch:', dbErr);
    }

    const contextData = `User's current expenses data: ${JSON.stringify(expenses)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `You are a helpful financial assistant inside a student budgeting app called PocketWise. Use this context about the user's finances if relevant: ${contextData}. Answer the user's question concisely.` },
            { text: message }
          ]
        }
      ],
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}