
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
Base your answers ONLY on the provided report context.

**Web Search Instructions:**
If the user asks a question that CANNOT be answered from the report, you MUST use the provided web search tool to find an answer.
When you use web search, you MUST:
1.  Clearly state that the information comes from a web search and is not part of their personal report (e.g., "I looked this up online and found that...").
2.  Format the answer in a clean, readable way. Use bullet points or short paragraphs.
3.  Synthesize the information into a helpful response. Do not just copy-paste search results.

Here is the user's financial report:
\`\`\`json
${JSON.stringify(analysisResult, null, 2)}
\`\`\``;

    const {output} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash'),
      tools: [googleAI.tool.googleSearch],
      history: [
        { role: 'system', content: systemPrompt },
        ...chatHistory.map(msg => ({ role: msg.role, content: msg.content }))
      ],
      prompt: chatHistory[chatHistory.length - 1].content,
    });

    return output!;
  }
);
