import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check if the request has a valid JSON body
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new NextResponse('Invalid content type', { status: 400 });
    }

    // Parse the JSON body to extract the 'query' property
    const requestBody = await request.json();
    const { query } = requestBody;

    // Make the API call to OpenAI Chat Completions
    const chat_completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { "type": "json_object" }, // Enable JSON mode
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: query }
      ],
    });

    // Extract the assistant's reply from the response
    const assistantReply = chat_completion.choices[0]?.message?.content;

    if (!assistantReply) {
      throw new Error('Empty or invalid response from OpenAI');
    }

    return NextResponse.json({ response: assistantReply });
  } catch (error) {
    console.error('Error processing request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
