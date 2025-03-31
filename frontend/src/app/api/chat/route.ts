import { streamText, experimental_createMCPClient as createMCPClient } from 'ai';
import { createTogetherAI } from '@ai-sdk/togetherai';

const openai = createTogetherAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
})

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const mcpClient = await createMCPClient({
    transport: {
      type: 'sse',
      url: 'http://localhost:8000/sse',
    },
  });


  try {
    const tools = await mcpClient.tools();
    console.log('Tools:', tools);

    const result = await streamText({
      model: openai(process.env.OPENAI_MODEL as string),
      tools: tools,
      messages,
      onFinish: async () => {
        await mcpClient.close();
      },
    });
    console.log('Generated text:', result.text);

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error generating text:', error);
    await mcpClient.close();
    return new Response(
      JSON.stringify({ error: 'Failed to generate text' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}