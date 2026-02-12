import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const model = google('gemini-2.5-flash-lite', {
  structuredOutputs: true,
  temperature: 0,
});
