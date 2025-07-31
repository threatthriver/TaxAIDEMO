import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {googleSearch} from 'genkit/tools';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-pro',
  tools: [googleSearch],
  allowLocalFiles: true,
});
