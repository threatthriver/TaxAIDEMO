'use client';

import type { AnalyzeTaxDocumentOutput } from '@/ai/flows/analyze-tax-document';
import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ArrowLeft, CheckCircle, FileText, Lightbulb, TrendingUp, Download, HelpCircle, MessageSquare, Send, Bot, User } from 'lucide-react';
import { chatWithReport } from '@/ai/flows/chat-with-report';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { ScrollArea } from './ui/scroll-area';

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

const ChatAssistant = ({ analysisResult }: { analysisResult: AnalyzeTaxDocumentOutput }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const chatHistory = [...messages, userMessage];
            const response = await chatWithReport({
                analysisResult,
                chatHistory
            });
            setMessages(prev => [...prev, { role: 'model' as const, content: response }]);
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Chat Error',
                description: 'Failed to get a response from the assistant.',
            });
             setMessages(prev => prev.slice(0, -1)); // remove optimistic user message
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <Card className="w-96 h-[60vh] flex flex-col shadow-2xl rounded-xl border-2 border-primary/20">
                    <CardHeader className="bg-primary/90 text-primary-foreground p-4 rounded-t-lg">
                        <CardTitle className="text-lg flex items-center gap-2">
                           <Bot /> AI Financial Assistant
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                        {msg.role === 'model' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                                        <div className={`rounded-lg px-4 py-2 max-w-xs text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-800'}`}>
                                            {msg.content}
                                        </div>
                                         {msg.role === 'user' && <User className="h-6 w-6 text-gray-600 flex-shrink-0" />}
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex items-start gap-3">
                                        <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                                        <div className="rounded-lg px-4 py-2 max-w-xs text-sm bg-gray-100 text-gray-800">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <div className="p-4 border-t">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <Input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask a follow-up question..."
                                className="flex-1"
                                disabled={loading}
                            />
                            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            )}
             <Button
                size="lg"
                onClick={() => setIsOpen(prev => !prev)}
                className="rounded-full w-16 h-16 shadow-lg flex items-center justify-center"
            >
                <MessageSquare className="h-8 w-8" />
            </Button>
        </div>
    );
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
        const element = printRef.current;
        if (!element) return;
    
        const canvas = await html2canvas(element, {
            scale: 2,
            logging: true,
            useCORS: true,
            backgroundColor: null
        });
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('Tax-Analysis-Report.pdf');
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
          <Card className="shadow-2xl border-t-4 border-primary" ref={printRef}>
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
              
              {result.whatIfAnalysis && (
                <Card className="bg-secondary/50 border-secondary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-800 text-2xl">
                            <HelpCircle />
                            "What-If" Scenario Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 leading-relaxed">{result.whatIfAnalysis}</p>
                    </CardContent>
                </Card>
              )}


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
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">Your Action Plan</CardTitle>
                <CardDescription className="mb-4">Check off these items as you complete them.</CardDescription>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                      <Progress value={progressPercentage} className="w-full h-3" />
                      <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">{completedCount} / {result.strategies.length} Completed</span>
                  </div>
                  <div className="space-y-3">
                      {result.strategies?.map((strategy) => (
                          <Card key={strategy.title} className={`p-4 border rounded-lg transition-all ${checkedStrategies[strategy.title] ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                              <div className="flex items-start gap-4">
                                  <Checkbox 
                                      id={strategy.title} 
                                      checked={checkedStrategies[strategy.title] || false}
                                      onCheckedChange={() => handleCheckboxChange(strategy.title)}
                                      className="mt-1 h-5 w-5"
                                  />
                                  <div className="flex-1">
                                      <label 
                                          htmlFor={strategy.title} 
                                          className={`font-semibold text-lg text-primary cursor-pointer ${checkedStrategies[strategy.title] ? 'line-through text-gray-500' : ''}`}
                                      >
                                          {strategy.title}
                                      </label>
                                      <p className={`text-green-600 font-bold ${checkedStrategies[strategy.title] ? 'line-through' : ''}`}>{strategy.potentialSavings}</p>
                                      <p className={`mt-2 text-gray-700 leading-relaxed ${checkedStrategies[strategy.title] ? 'opacity-70' : ''}`}>{strategy.description}</p>
                                      <div className={`mt-3 bg-primary/10 p-3 rounded-lg border border-primary/20 ${checkedStrategies[strategy.title] ? 'opacity-60' : ''}`}>
                                          <p className="font-semibold text-primary/90 flex items-center gap-2"><CheckCircle className="h-5 w-5"/>Actionable Step:</p>
                                          <p className="text-primary/80 mt-1 pl-7">{strategy.action}</p>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-3 font-code">Relevant Section: {strategy.relevantSection}</p>
                                  </div>
                              </div>
                          </Card>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
     <ChatAssistant analysisResult={result} />
    </>
  );
}
