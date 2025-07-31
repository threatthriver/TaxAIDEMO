'use client';

import type { AnalyzeTaxDocumentOutput } from '@/ai/flows/analyze-tax-document';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type AnalysisResultDisplayProps = {
  result: AnalyzeTaxDocumentOutput;
  onReset: () => void;
};

export default function AnalysisResultDisplay({ result, onReset }: AnalysisResultDisplayProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
            <CardTitle className="text-3xl font-bold">Your AI-Generated Tax Plan</CardTitle>
            <Button onClick={onReset} variant="outline">
              Start New Analysis
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <h3 className="text-xl font-bold text-primary mb-2">Executive Summary</h3>
            <p className="text-primary/90">{result.executiveSummary}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-bold text-gray-700 mb-2">Document Type Identified</h4>
              <p className="font-code bg-gray-200 text-gray-800 inline-block px-2 py-1 rounded">{result.documentType}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-bold text-gray-700 mb-2">Key Figures Extracted</h4>
              <ul className="space-y-2">
                {result.keyFigures?.map((fig, index) => (
                  <li key={index} className="flex justify-between text-sm py-1 border-b last:border-b-0">
                    <span className="text-muted-foreground">{fig.name}:</span>
                    <span className="font-semibold text-foreground">{fig.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Recommended Strategies</h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {result.strategies?.map((strategy, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border-b-0 border rounded-lg bg-white overflow-hidden">
                  <AccordionTrigger className="w-full flex justify-between items-center p-4 text-left hover:no-underline">
                    <span className="font-semibold text-primary">{strategy.title}</span>
                    <div className="flex items-center">
                       <span className="text-sm font-bold text-green-600 mr-4">{strategy.potentialSavings}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-gray-50 border-t">
                    <p className="text-gray-700 mb-3">{strategy.description}</p>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="font-semibold text-primary/90">Actionable Step:</p>
                      <p className="text-primary/80">{strategy.action}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 font-code">Relevant Section: {strategy.relevantSection}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
