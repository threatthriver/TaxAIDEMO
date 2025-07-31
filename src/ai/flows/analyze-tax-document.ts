'use server';

/**
 * @fileOverview An AI agent that analyzes tax documents and provides potential tax savings strategies.
 *
 * - analyzeTaxDocument - A function that handles the tax document analysis process.
 * - AnalyzeTaxDocumentInput - The input type for the analyzeTaxDocument function.
 * - AnalyzeTaxDocumentOutput - The return type for the analyzeTaxDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const AnalyzeTaxDocumentInputSchema = z.object({
  fileDataUris: z
    .array(z.string())
    .describe(
      "A list of tax documents, each as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  country: z.string().describe('The country of residence for tax purposes.'),
  analysisType: z.string().describe('The type of analysis requested (Individual/Personal, Small Business/LLC, Corporation).'),
});
export type AnalyzeTaxDocumentInput = z.infer<typeof AnalyzeTaxDocumentInputSchema>;

const AnalyzeTaxDocumentOutputSchema = z.object({
  documentTypes: z.array(z.string()).describe('The types of documents identified by the AI.'),
  keyFigures: z.array(
    z.object({
      name: z.string().describe('The name of the key figure.'),
      value: z.string().describe('The value of the key figure.'),
    })
  ).describe('Key financial figures extracted from the documents.'),
  financialHealthSummary: z.string().describe('A narrative summary of the client\'s overall financial health based on all provided documents.'),
  executiveSummary: z.string().describe('A brief, high-level summary of the findings and total potential savings.'),
  strategies: z.array(
    z.object({
      title: z.string().describe('The title of the tax-saving strategy.'),
      description: z.string().describe('A detailed explanation of the strategy.'),
      action: z.string().describe('A clear, actionable step for the client.'),
      relevantSection: z.string().describe('Applicable tax law section.'),
      potentialSavings: z.string().describe('Estimated potential savings from the strategy.'),
    })
  ).describe('A list of recommended tax-saving strategies.'),
});
export type AnalyzeTaxDocumentOutput = z.infer<typeof AnalyzeTaxDocumentOutputSchema>;

export async function analyzeTaxDocument(input: AnalyzeTaxDocumentInput): Promise<AnalyzeTaxDocumentOutput> {
  return analyzeTaxDocumentFlow(input);
}

const analyzeTaxDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeTaxDocumentFlow',
    inputSchema: AnalyzeTaxDocumentInputSchema,
    outputSchema: AnalyzeTaxDocumentOutputSchema,
  },
  async ( input ) => {
    const {output} = await ai.generate({
      model: googleAI.model('gemini-2.5-pro'),
      prompt: `You are an expert tax consultant and financial analyst for ${input.country}. Analyze the provided financial documents for a client requesting a "${input.analysisType}" analysis. Based on a holistic review of all documents, provide a detailed, actionable tax-saving plan and a financial health assessment.

**Instructions:**
1.  **Identify Document Types:** First, identify the type of each document provided.
2.  **Extract Key Figures:** Consolidate and extract the most relevant financial figures from all documents.
3.  **Assess Financial Health:** Write a narrative "Financial Health Summary" that describes the client's overall financial situation. This should synthesize information from all documents to provide a clear picture of their financial strengths and weaknesses.
4.  **Generate Executive Summary:** Create a brief, high-level summary of the key findings and total potential tax savings.
5.  **Develop Tax Strategies:** Based on the consolidated figures, generate a list of specific, actionable tax-saving strategies relevant to ${input.country}'s tax laws. For each strategy, you MUST estimate the potential annual savings as a string (e.g., "$2,000 - $3,000" or "₹50,000 - ₹75,000").
6.  **Analyze Documents:** Analyze the following documents: ${input.fileDataUris.join(' ')}
`,
      output: {
        schema: AnalyzeTaxDocumentOutputSchema
      }
    });

    return output!;
  }
);
