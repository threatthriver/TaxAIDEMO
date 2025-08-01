
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ClipboardList, FileText, Users, Calculator, FileDown, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode, title: string; children: React.ReactNode }) => (
  <Card className="bg-card p-4 text-left shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary/20 hover:border-primary animate-fade-in-up">
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
      <section className="bg-background pt-24 md:pt-32">
        <div className="container mx-auto px-6 py-12 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-4 leading-tight">
              Automated Tax Planning. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Unmatched Savings.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Streamline your tax strategy. Upload documents or fill out our questionnaire to generate a comprehensive, professional tax plan in minutes.
            </p>
            <div className="flex justify-center gap-4">
                <Link href="/planner">
                <Button size="lg" className="px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow rounded-full">
                    Create My Tax Plan
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                </Link>
                <Link href="/solutions">
                <Button size="lg" variant="outline" className="px-10 py-7 text-lg font-semibold rounded-full">
                    Learn More
                </Button>
                </Link>
            </div>
          </div>
          <div className="relative mt-20 animate-fade-in-up">
             <Image
                src="https://images.unsplash.com/photo-1563198804-b144dfc1661c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxUYXh8ZW58MHx8fHwxNzUzOTYyOTE5fDA&ixlib=rb-4.1.0&q=80&w=1080"
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
            <FeatureCard title="Client Data Collection" icon={<ClipboardList className="h-6 w-6 text-primary" />}>
              Gather all necessary client information seamlessly with our built-in, intelligent questionnaires.
            </FeatureCard>
            <FeatureCard title="Instant Strategy Calculation" icon={<Calculator className="h-6 w-6 text-primary" />}>
              Our AI instantly evaluates your data against over 60 tax-saving strategies to find every opportunity.
            </FeatureCard>
             <FeatureCard title="Multi-Entity & Multi-Year" icon={<FileText className="h-6 w-6 text-primary" />}>
              Create comprehensive plans for multiple entities and across multiple years in just a few clicks.
            </FeatureCard>
            <FeatureCard title="Custom PDF Proposals" icon={<FileDown className="h-6 w-6 text-primary" />}>
              Generate professional, client-ready tax plans and proposals in a polished PDF format with one click.
            </FeatureCard>
            <FeatureCard title="In-depth Strategy Details" icon={<Check className="h-6 w-6 text-primary" />}>
              Learn how each calculation works with detailed pros and cons, tax code references, and requirements.
            </FeatureCard>
             <FeatureCard title="Access to Tax Experts" icon={<Users className="h-6 w-6 text-primary" />}>
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
            <Link href="/planner">
              <Button size="lg" className="mt-8 px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow rounded-full">
                Start My Free Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
        </div>
      </section>
    </>
  );
}
