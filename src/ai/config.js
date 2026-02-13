import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { logger } from '../utils/logger.js';

const apiKey = process.env.GEMINI_AI_API_KEY;

if (!apiKey) {
  logger.error('Error: GEMINI_AI_API_KEY is not defined in your .env file.');

  process.exit(1);
}

const google = createGoogleGenerativeAI({
  apiKey: apiKey,
});

export const model = google('gemini-2.5-flash-lite', {
  structuredOutputs: true,
  temperature: 0,
});
