import { NextRequest, NextResponse } from 'next/server';

// Make sure OPENAI_API_KEY is set in your .env.local file
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request: messages array required.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured.' }, { status: 500 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview', // Closest available to GPT-4.1 as of 2024
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.error?.message || 'OpenAI API error.' }, { status: 500 });
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ message: aiMessage });
  } catch (err) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 