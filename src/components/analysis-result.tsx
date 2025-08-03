
'use client';

import type { AnalyzeTaxDocumentOutput } from '@/ai/flows/analyze-tax-document';
import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ArrowLeft, CheckCircle, FileText, Lightbulb, TrendingUp, Download, HelpCircle } from 'lucide-react';
import ChatAssistant from '@/components/chat-assistant';
import { Badge } from '@/components/ui/badge';

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
    const [checkedStrategies, setCheckedStrategies] = useState<Record<string, boolean>>({});
    const printRef = useRef<HTMLDivElement>(null);

    const handleCheckboxChange = (title: string) => {
        setCheckedStrategies(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const completedCount = Object.values(checkedStrategies).filter(Boolean).length;
    const progressPercentage = result.strategies.length > 0 ? (completedCount / result.strategies.length) * 100 : 0;
    
    const handleDownloadPdf = async () => {
        const content = printRef.current;
        if (!content) return;

        const doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4',
        });

        doc.html(content, {
            callback: function (doc) {
                doc.save('Tax-Analysis-Report.pdf');
            },
            html2canvas: {
                scale: 0.7, // Adjust scale to fit content on the page
                useCORS: true,
                logging: true
            },
            x: 15,
            y: 15,
            width: 555, // A4 width in points is 595, minus margins
            windowWidth: content.scrollWidth,
        });
    };

    const chartData = result.strategies.map(strategy => ({
        name: strategy.title,
        savings: parseSavings(strategy.potentialSavings)
    })).filter(item => item.savings > 0).sort((a, b) => b.savings - a.savings);

  return (
    <>
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <Button onClick={onReset} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Start New Analysis
                </Button>
                <Button onClick={handleDownloadPdf} variant="default">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
            </div>
          <div ref={printRef} className="bg-card p-6 sm:p-10 rounded-xl shadow-lg">
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Your AI-Generated Financial Plan</h1>
                    <Badge variant="outline" className="text-sm font-semibold border-primary/50 text-primary/80">
                        Preview
                    </Badge>
                </div>
                <p className="text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
            </header>
            <main className="space-y-12">
              <Card className="bg-primary/5 border-primary/20 ring-1 ring-primary/20">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-primary text-2xl">
                        <Lightbulb />
                        Executive Summary
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-lg text-primary/90">{result.executiveSummary}</p>
                 </CardContent>
              </Card>
              
              {result.whatIfAnalysis && (
                <Card className="bg-secondary/50 border-secondary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground text-2xl">
                            <HelpCircle />
                            "What-If" Scenario Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{result.whatIfAnalysis}</p>
                    </CardContent>
                </Card>
              )}


              <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground text-2xl">
                        <TrendingUp />
                        Financial Health Summary
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{result.financialHealthSummary}</p>
                 </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground/80 text-xl">
                        <FileText/>
                        Documents Analyzed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {result.documentTypes?.map((docType, index) => (
                        <p key={index} className="font-mono bg-secondary text-secondary-foreground inline-block px-3 py-1 rounded-full text-sm border">{docType}</p>
                    ))}
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="text-foreground/80 text-xl">Key Figures</CardTitle>
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
                        <CardTitle className="text-2xl font-bold text-foreground">Potential Savings Visualization</CardTitle>
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
                                            className="bg-card/80 backdrop-blur-sm rounded-lg shadow-lg border"
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
                <CardHeader className="px-0">
                    <CardTitle className="text-2xl font-bold text-foreground">Your Action Plan</CardTitle>
                    <CardDescription>Check off these items as you complete them.</CardDescription>
                </CardHeader>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                      <Progress value={progressPercentage} className="w-full h-3" />
                      <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">{completedCount} / {result.strategies.length} Completed</span>
                  </div>
                  <div className="space-y-3">
                      {result.strategies?.map((strategy) => (
                          <Card key={strategy.title} data-state={checkedStrategies[strategy.title] ? 'checked' : 'unchecked'} className="data-[state=checked]:bg-green-50 data-[state=checked]:border-green-200 p-4 border rounded-lg transition-all">
                              <div className="flex items-start gap-4">
                                  <Checkbox 
                                      id={strategy.title} 
                                      checked={checkedStrategies[strategy.title] || false}
                                      onCheckedChange={() => handleCheckboxChange(strategy.title)}
                                      className="mt-1 h-5 w-5"
                                  />
                                  <div className="flex-1 space-y-1">
                                      <label 
                                          htmlFor={strategy.title} 
                                          className="font-semibold text-lg text-primary cursor-pointer data-[state=checked]:line-through data-[state=checked]:text-muted-foreground"
                                          data-state={checkedStrategies[strategy.title] ? 'checked' : 'unchecked'}
                                      >
                                          {strategy.title}
                                      </label>
                                       <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{maxHeight: checkedStrategies[strategy.title] ? '0px' : '500px', opacity: checkedStrategies[strategy.title] ? 0 : 1}}>
                                          <p className="text-green-600 font-bold">{strategy.potentialSavings}</p>
                                          <p className="mt-2 text-muted-foreground leading-relaxed">{strategy.description}</p>
                                          <div className="mt-3 bg-primary/10 p-3 rounded-lg border border-primary/20">
                                              <p className="font-semibold text-primary/90 flex items-center gap-2"><CheckCircle className="h-5 w-5"/>Actionable Step:</p>
                                              <p className="text-primary/80 mt-1 pl-7">{strategy.action}</p>
                                          </div>
                                          <p className="text-xs text-gray-500 mt-3 font-mono">Relevant Section: {strategy.relevantSection}</p>
                                       </div>
                                  </div>
                              </div>
                          </Card>
                      ))}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
     <ChatAssistant analysisResult={result} />
    </>
  );
}
