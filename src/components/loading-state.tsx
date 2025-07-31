
'use client';

import { useState, useEffect } from 'react';
import { Bot, FileScan, FunctionSquare, DollarSign, Sparkles, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const analysisSteps = [
    { text: "Scanning document integrity...", icon: <FileScan className="h-6 w-6 text-primary" /> },
    { text: "Extracting key financial data...", icon: <FunctionSquare className="h-6 w-6 text-primary" /> },
    { text: "Identifying applicable tax laws for your region...", icon: <Sparkles className="h-6 w-6 text-primary" /> },
    { text: "Calculating over 60 potential tax strategies...", icon: <DollarSign className="h-6 w-6 text-primary" /> },
    { text: "Compiling your personalized financial plan...", icon: <CheckCircle className="h-6 w-6 text-primary" /> },
];

export default function LoadingState() {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setCurrentStep(prevStep => {
                if (prevStep < analysisSteps.length - 1) {
                    return prevStep + 1;
                }
                clearInterval(stepInterval);
                return prevStep;
            });
        }, 2500); // Change step every 2.5 seconds

        const progressInterval = setInterval(() => {
            setProgress(prev => (prev < 95 ? prev + 2 : prev));
        }, 500);

        return () => {
            clearInterval(stepInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-20 min-h-[70vh] bg-background">
            <div className="w-full max-w-2xl text-center">
                 <div className="relative mb-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                        <Bot className="w-16 h-16 text-primary animate-pulse" />
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold text-foreground mb-4">
                    Your AI is thinking...
                </h2>
                <p className="text-lg text-muted-foreground mb-12">
                   Please wait while we generate your professional tax proposal.
                </p>

                <div className="w-full max-w-lg mx-auto">
                    <Progress value={progress} className="w-full h-2 mb-4" />
                    <div className="relative h-8 overflow-hidden">
                         {analysisSteps.map((step, index) => (
                            <div
                                key={index}
                                className="absolute w-full transition-transform duration-500 ease-in-out flex items-center justify-center gap-3"
                                style={{ transform: `translateY(${(index - currentStep) * 100}%)` }}
                            >
                                {step.icon}
                                <span className="text-muted-foreground text-lg">{step.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
