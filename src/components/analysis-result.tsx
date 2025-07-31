'use client';

import type { AnalyzeTaxDocumentOutput } from '@/ai/flows/analyze-tax-document';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ArrowLeft, CheckCircle, FileText, Lightbulb, TrendingUp } from 'lucide-react';

type AnalysisResultDisplayProps = {
  result: AnalyzeTaxDocumentOutput;
  onReset: () => void;
};

// Helper function to parse savings string and calculate an average
const parseSavings = (savings: string): number => {
    const cleanedString = savings.replace(/[$,₹€£]/g, '').replace(/,/g, '');
    const numbers = cleanedString.split('-').map(s => parseFloat(s.trim()));
    if (numbers.length > 1) {
      return (numbers[0] + numbers[1]) / 2;
    }
    if (numbers.length === 1 && !isNaN(numbers[0])) {
      return numbers[0];
    }
    return 0;
};


export default function AnalysisResultDisplay({ result, onReset }: AnalysisResultDisplayProps) {
    const chartData = result.strategies.map(strategy => ({
        name: strategy.title,
        savings: parseSavings(strategy.potentialSavings)
    })).filter(item => item.savings > 0).sort((a, b) => b.savings - a.savings);

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
           <Button onClick={onReset} variant="outline" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Start New Analysis
            </Button>
          <Card className="shadow-2xl border-t-4 border-primary">
            <CardHeader>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <CardTitle className="text-3xl font-bold">Your AI-Generated Financial Plan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-10">
              <Card className="bg-primary/5 border-primary/20">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary text-2xl">
                        <Lightbulb />
                        Executive Summary
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-lg text-primary/90">{result.executiveSummary}</p>
                 </CardContent>
              </Card>

              <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 text-2xl">
                        <TrendingUp />
                        Financial Health Summary
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-gray-700 leading-relaxed">{result.financialHealthSummary}</p>
                 </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-700 text-xl">
                        <FileText/>
                        Documents Analyzed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {result.documentTypes?.map((docType, index) => (
                        <p key={index} className="font-code bg-gray-100 text-gray-800 inline-block px-3 py-1 rounded-full text-sm border">{docType}</p>
                    ))}
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="text-gray-700 text-xl">Key Figures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                        {result.keyFigures?.map((fig, index) => (
                        <li key={index} className="flex justify-between text-sm py-2 border-b last:border-b-0">
                            <span className="text-muted-foreground">{fig.name}</span>
                            <span className="font-semibold text-foreground">{fig.value}</span>
                        </li>
                        ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
               {chartData.length > 0 && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-800">Potential Savings Visualization</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={{}} className="min-h-[250px] w-full">
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" tickFormatter={(value) => `$${Number(value).toLocaleString()}`} />
                                    <YAxis dataKey="name" type="category" width={150} interval={0} tick={{fontSize: 12, fill: '#374151'}} />
                                    <Tooltip
                                        cursor={{fill: 'rgba(243, 244, 246, 0.5)'}}
                                        content={<ChartTooltipContent
                                            formatter={(value) => (`$${Number(value).toLocaleString()}`)}
                                            labelClassName="font-bold"
                                            className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border"
                                        />}
                                    />
                                    <Bar dataKey="savings" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                 </Card>
               )}

              <div>
                <CardTitle className="text-2xl font-bold text-gray-800 mb-4">Recommended Tax Strategies</CardTitle>
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {result.strategies?.map((strategy, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="border-b-0 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                      <AccordionTrigger className="w-full flex justify-between items-center p-4 text-left hover:no-underline">
                        <span className="font-semibold text-primary text-lg">{strategy.title}</span>
                         <span className="text-lg font-bold text-green-600 mr-4 whitespace-nowrap">{strategy.potentialSavings}</span>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 bg-gray-50/50 border-t">
                        <p className="text-gray-700 mb-4 leading-relaxed">{strategy.description}</p>
                        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                          <p className="font-semibold text-primary/90 flex items-center gap-2"><CheckCircle className="h-5 w-5"/>Actionable Step:</p>
                          <p className="text-primary/80 mt-1 pl-7">{strategy.action}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-4 font-code">Relevant Section: {strategy.relevantSection}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
