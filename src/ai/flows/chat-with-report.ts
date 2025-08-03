
'use server';

/**
 * @fileOverview A conversational AI agent that answers user questions based on their tax analysis report.
 *
 * - chatWithReport - A function that handles the conversational chat process.
 * - ChatWithReportInput - The input type for the chatWithReport function.
 * - ChatWithReportOutput - The return type for the chatWithReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import type { AnalyzeTaxDocumentOutput } from './analyze-tax-document';


const ChatWithReportInputSchema = z.object({
  analysisResult: z.any().describe("The full JSON object of the user's tax analysis report."),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The history of the conversation so far.'),
});
export type ChatWithReportInput = z.infer<typeof ChatWithReportInputSchema>;

export type ChatWithReportOutput = string;

export async function chatWithReport(input: ChatWithReportInput): Promise<ChatWithReportOutput> {
  return chatWithReportFlow(input);
}

const chatWithReportFlow = ai.defineFlow(
  {
    name: 'chatWithReportFlow',
    inputSchema: ChatWithReportInputSchema,
    outputSchema: z.string(),
  },
  async ({ analysisResult, chatHistory }) => {

    const systemPrompt = `You are an expert financial assistant. Your role is to answer follow-up questions from the user based on the detailed financial analysis report provided below.
Be helpful, clear, and concise. Do not provide financial advice, but explain concepts and the information in the report clearly.
Base your answers ONLY on the provided report context. Do not use external knowledge or web search.

Here is the user's financial report:
\`\`\`json
${JSON.stringify(analysisResult, null, 2)}
\`\`\``;

    const {output} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash'),
      history: [
        { role: 'system', content: systemPrompt },
        ...chatHistory.map(msg => ({ role: msg.role, content: msg.content }))
      ],
      prompt: chatHistory[chatHistory.length - 1].content,
    });

    return output!;
  }
);
