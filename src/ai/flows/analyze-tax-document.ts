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
  fileDataUri: z
    .string()
    .describe(
      "A tax document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  country: z.string().describe('The country of residence for tax purposes.'),
  analysisType: z.string().describe('The type of analysis requested (Individual/Personal, Small Business/LLC, Corporation).'),
});
export type AnalyzeTaxDocumentInput = z.infer<typeof AnalyzeTaxDocumentInputSchema>;

const AnalyzeTaxDocumentOutputSchema = z.object({
  documentType: z.string().describe('The type of document identified by the AI.'),
  keyFigures: z.array(
    z.object({
      name: z.string().describe('The name of the key figure.'),
      value: z.string().describe('The value of the key figure.'),
    })
  ).describe('Key financial figures extracted from the document.'),
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
      model: googleAI.model('gemini-1.5-pro-latest'),
      prompt: `You are an expert tax consultant for ${input.country}. Analyze the provided financial document for a client requesting a "${input.analysisType}" analysis. Based on the document's content, provide a detailed, actionable tax-saving plan.

**Instructions:**
1. **Identify Document Type:** First, identify the type of document provided.
2. **Extract Key Figures:** Extract the most relevant financial figures.
3. **Generate Strategies:** Based on the figures, generate a list of specific, actionable tax-saving strategies relevant to ${input.country}'s tax laws. For each strategy, you MUST estimate the potential annual savings as a string (e.g., "$2,000 - $3,000" or "₹50,000 - ₹75,000").
4. **Analyze Document:** Analyze the following document: ${input.fileDataUri}
`,
      output: {
        schema: AnalyzeTaxDocumentOutputSchema
      }
    });

    return output!;
  }
);
