import {genkit} from 'genkit';
import {googleAI, googleSearch} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({tools: [googleSearch]})],
  model: 'googleai/gemini-2.5-pro',
  allowLocalFiles: true,
});
