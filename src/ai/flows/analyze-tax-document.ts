
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
  taxYear: z.string().optional().describe('The primary tax year for the analysis. The AI should also consider multi-year plans if documents from other years are provided.'),
  additionalNotes: z.string().optional().describe('Optional user-provided notes, questions, or goals to guide the analysis, including "what-if" scenarios.'),
  model: z.string().optional().describe('The AI model to use for the analysis.'),
  // New Structured Inputs
  incomeAndInvestments: z.object({
    employmentIncome: z.string().optional(),
    investmentIncome: z.string().optional().describe('e.g., dividends, capital gains'),
    retirementContributions: z.string().optional().describe('e.g., 401(k), IRA'),
  }).optional(),
  deductionsAndCredits: z.object({
    mortgageInterest: z.string().optional(),
    charitableDonations: z.string().optional(),
    studentLoanInterest: z.string().optional(),
    otherDeductions: z.string().optional(),
  }).optional(),
  businessAndRental: z.object({
    businessRevenue: z.string().optional(),
    businessExpenses: z.string().optional(),
    rentalIncome: z.string().optional(),
    rentalExpenses: z.string().optional(),
  }).optional(),
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
  whatIfAnalysis: z.string().optional().describe('A dedicated section addressing any "what-if" scenarios or specific questions posed by the user.'),
  strategies: z.array(
    z.object({
      title: z.string().describe('The title of the tax-saving strategy.'),
      description: z.string().describe('A detailed explanation of the strategy, its pros, and its cons.'),
      action: z.string().describe('A clear, actionable step for the client.'),
      relevantSection: z.string().describe('Applicable tax law section, rule, or form name.'),
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
      model: googleAI.model(input.model || 'gemini-2.5-pro'),
      tools: [{tool: googleAI.tool.googleSearch}],
      prompt: `You are a world-class tax planning software. Your purpose is to provide a comprehensive, automated, and streamlined tax plan for clients in ${input.country}.
Your task is to conduct a multi-faceted analysis for a "${input.analysisType}" client for the tax year ${input.taxYear}. You must also consider multi-year and multi-entity planning if the user provides relevant documents or notes.

Your response must be a professional, client-ready proposal that is highly educational and actionable.

**Core Analysis Instructions:**
1.  **Use Web Search for Accuracy:** You MUST use the provided web search tool to find the most recent tax laws and financial information relevant to the user's country and situation. This is critical for ensuring your recommendations are up-to-date.
2.  **Identify Document Types:** If documents are provided, thoroughly identify the type of each document (e.g., "US Form 1040", "Profit and Loss Statement", "Balance Sheet", "ITR-V (India)"). Note if documents from multiple years are present, as this indicates a multi-year analysis.
3.  **Extract Key Financial Figures:** Consolidate and extract the most relevant financial figures from both the structured data and any provided documents. Be comprehensive. Examples: Total Income, Gross Profit, Net Income, Total Deductions, Taxable Income, Key Asset/Liability values, etc.
4.  **Assess Overall Financial Health:** Write a detailed narrative under the "Financial Health Summary". This is crucial. Synthesize information from all sources to provide a clear picture of the client's financial situation, including strengths, weaknesses, trends, and potential areas of concern.
5.  **Develop In-Depth Tax Strategies (Calculate over 60+ strategies if applicable):** Based on your consolidated analysis, generate a list of specific, actionable tax-saving strategies highly relevant to ${input.country}'s tax laws and the client's specific situation. For each strategy, you MUST provide:
    *   A clear "title".
    *   A detailed "description" that is educational, explaining the strategy, its benefits, pros, and cons.
    *   A concrete, actionable next "step" for the client.
    *   The "relevantSection" of the tax code, law, or form that applies (e.g., "IRC Section 179", "Section 80C of the Income Tax Act, 1961").
    *   A realistic "potentialSavings" estimate as a string (e.g., "$2,000 - $3,000" or "₹50,000 - ₹75,000").
6.  **Address User's Specific Notes (What-If Analysis):**
${input.additionalNotes ? `The client has provided the following notes, questions, or goals. You MUST address these in a dedicated "whatIfAnalysis" section. This is critical. Directly answer their questions or model the scenarios they've described (e.g., 'What if I contributed an extra $5,000 to my retirement account?'). Your analysis here should be distinct from the main strategy recommendations. Client notes: "${input.additionalNotes}"` : "The client has not provided any specific notes. The whatIfAnalysis field can be omitted."}
7.  **Generate an Executive Summary:** Create a brief, high-level summary of the key findings and the total estimated potential tax savings AFTER completing all other analysis steps. This should be concise and impactful.

**Client Questionnaire Data (Prioritize this structured data):**
- **Tax Year:** ${input.taxYear || 'Not Provided'}
- **Income & Investments:**
  - Employment Income: ${input.incomeAndInvestments?.employmentIncome || 'Not Provided'}
  - Investment Income (dividends, capital gains): ${input.incomeAndInvestments?.investmentIncome || 'Not Provided'}
  - Retirement Contributions (401k, IRA): ${input.incomeAndInvestments?.retirementContributions || 'Not Provided'}
- **Deductions & Credits:**
  - Mortgage Interest: ${input.deductionsAndCredits?.mortgageInterest || 'Not Provided'}
  - Charitable Donations: ${input.deductionsAndCredits?.charitableDonations || 'Not Provided'}
  - Student Loan Interest: ${input.deductionsAndCredits?.studentLoanInterest || 'Not Provided'}
  - Other Key Deductions: ${input.deductionsAndCredits?.otherDeductions || 'Not Provided'}
- **Business & Rental Income:**
  - Business Revenue: ${input.businessAndRental?.businessRevenue || 'Not Provided'}
  - Business Expenses: ${input.businessAndRental?.businessExpenses || 'Not Provided'}
  - Rental Income: ${input.businessAndRental?.rentalIncome || 'Not Provided'}
  - Rental Expenses: ${input.businessAndRental?.rentalExpenses || 'Not Provided'}

**Analyze Uploaded Documents (Use as supplementary info):**
{{#if fileDataUris}}
The following documents are also provided for your analysis:
  {{#each fileDataUris}}
    {{media url=this}}
  {{/each}}
{{else}}
No documents were uploaded. Base your analysis solely on the structured data provided.
{{/if}}
`,
      output: {
        schema: AnalyzeTaxDocumentOutputSchema
      }
    });

    return output!;
  }
);
