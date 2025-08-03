
'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ClipboardList, FileText, Users, Calculator, FileDown, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';


const FeatureCard = ({ icon, title, children, className }: { icon: React.ReactNode, title: string; children: React.ReactNode, className?: string }) => (
  <Card className={cn("bg-card p-4 text-left shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary/20 hover:border-primary", className)}>
    <CardHeader className="flex flex-row items-center gap-4">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{children}</p>
    </CardContent>
  </Card>
);

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-background pt-12 md:pt-20 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-rose-400/10 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 py-12 text-center relative z-10">
          <div className="animate-slide-in-from-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-4 leading-tight">
              Automated Tax Planning. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">Unmatched Savings.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Streamline your tax strategy. Upload documents or fill out our questionnaire to generate a comprehensive, professional tax plan in minutes.
            </p>
            <div className="flex justify-center gap-4">
                <Link href="/planner" className={cn(buttonVariants({ size: 'lg' }), "px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow")}>
                    Create My Tax Plan
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/solutions" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), "px-10 py-7 text-lg font-semibold")}>
                    Learn More
                </Link>
            </div>
          </div>
          <div className="relative mt-20 animate-slide-in-from-right">
             <Image
                src="https://images.unsplash.com/photo-1554224155-1696413565d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxmaW5hbmNlJTIwdGVhbXxlbnwwfHx8fDE3NTM5NjQ5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Tax documents and charts illustration"
                width={1200}
                height={600}
                className="rounded-xl shadow-2xl"
                data-ai-hint="finance abstract"
             />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground">The Future of Tax Strategy is Here</h2>
            <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">An end-to-end solution designed for accuracy, efficiency, and actionable insights.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard title="Client Data Collection" icon={<ClipboardList className="h-6 w-6 text-primary" />} className="animate-scale-in" style={{animationDelay: '0s'}}>
              Gather all necessary client information seamlessly with our built-in, intelligent questionnaires.
            </FeatureCard>
            <FeatureCard title="Instant Strategy Calculation" icon={<Calculator className="h-6 w-6 text-primary" />} className="animate-scale-in" style={{animationDelay: '0.1s'}}>
              Our AI instantly evaluates your data against over 60 tax-saving strategies to find every opportunity.
            </FeatureCard>
             <FeatureCard title="Multi-Entity & Multi-Year" icon={<FileText className="h-6 w-6 text-primary" />} className="animate-scale-in" style={{animationDelay: '0.2s'}}>
              Create comprehensive plans for multiple entities and across multiple years in just a few clicks.
            </FeatureCard>
            <FeatureCard title="Custom PDF Proposals" icon={<FileDown className="h-6 w-6 text-primary" />} className="animate-scale-in" style={{animationDelay: '0.3s'}}>
              Generate professional, client-ready tax plans and proposals in a polished PDF format with one click.
            </FeatureCard>
            <FeatureCard title="In-depth Strategy Details" icon={<Check className="h-6 w-6 text-primary" />} className="animate-scale-in" style={{animationDelay: '0.4s'}}>
              Learn how each calculation works with detailed pros and cons, tax code references, and requirements.
            </FeatureCard>
             <FeatureCard title="Access to Tax Experts" icon={<Users className="h-6 w-6 text-primary" />} className="animate-scale-in" style={{animationDelay: '0.5s'}}>
              Stuck on a complex issue? Get support from our dedicated team of in-house tax experts.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-6 text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground">Ready to Take Control of Your Taxes?</h2>
            <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
                Stop leaving money on the table. Generate your personalized, AI-powered tax plan today and discover your potential savings.
            </p>
            <Link href="/planner" className={cn(buttonVariants({ size: 'lg' }), "mt-8 px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow")}>
                Start My Free Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
        </div>
      </section>
    </>
  );
}
