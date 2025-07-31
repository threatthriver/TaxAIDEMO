
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
  additionalNotes: z.string().optional().describe('Optional user-provided notes, questions, or goals to guide the analysis, including "what-if" scenarios.'),
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
      prompt: `You are a world-class tax consultant and financial analyst providing services for clients in ${input.country}.
Your task is to conduct a comprehensive analysis of the provided financial documents AND the structured financial data for a client who has requested a "${input.analysisType}" analysis.
Your response must be professional, insightful, and provide a clear, actionable tax-saving plan and a holistic financial health assessment.

**Prioritize analysis of the structured data provided by the user, and use the uploaded documents as supplementary information or for cross-verification.**

**Core Analysis Instructions:**
1.  **Identify Document Types:** If documents are provided, thoroughly identify the type of each document (e.g., "US Form 1040", "Profit and Loss Statement", "Balance Sheet", "ITR-V (India)").
2.  **Extract Key Financial Figures:** Consolidate and extract the most relevant financial figures from both the structured data and any provided documents. Be comprehensive. Examples include: Total Income, Gross Profit, Net Income, Total Deductions, Taxable Income, Key Asset/Liability values, etc.
3.  **Assess Overall Financial Health:** Write a detailed narrative under the "Financial Health Summary". This is crucial. It should synthesize information from all sources to provide a clear picture of the client's financial situation, including strengths, weaknesses, trends, and potential areas of concern.
4.  **Develop In-Depth Tax Strategies:** Based on your consolidated analysis, generate a list of specific, actionable tax-saving strategies that are highly relevant to ${input.country}'s tax laws and the client's specific situation. For each strategy, you MUST provide:
    *   A clear "title".
    *   A detailed "description" explaining the strategy and its benefits.
    *   A concrete, actionable next "step" for the client.
    *   The "relevantSection" of the tax code or law that applies.
    *   A realistic "potentialSavings" estimate as a string (e.g., "$2,000 - $3,000" or "₹50,000 - ₹75,000").
5.  **Address User's Specific Notes (What-If Analysis):**
${input.additionalNotes ? `The client has provided the following notes, questions, or goals. You MUST address these in a dedicated "whatIfAnalysis" section. This is critical. Directly answer their questions or model the scenarios they've described (e.g., 'What if I contributed an extra $5,000 to my retirement account?'). Your analysis here should be distinct from the main strategy recommendations but can reference them. Client notes: "${input.additionalNotes}"` : "The client has not provided any specific notes. The whatIfAnalysis field can be omitted."}
6. **Generate an Executive Summary:** Create a brief, high-level summary of the key findings and the total estimated potential tax savings AFTER completing all other analysis steps. This should be concise and impactful.

**Structured User-Provided Data for Analysis:**
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

**Analyze Uploaded Documents (if any):**
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
