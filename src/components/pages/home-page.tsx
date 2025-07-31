'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, BarChart, FileText, Globe } from 'lucide-react';
import Image from 'next/image';


type HomePageProps = {
  setPage: (page: 'planner') => void;
};

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode, title: string; children: React.ReactNode }) => (
  <Card className="bg-white p-4 text-left shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary/20 hover:border-primary">
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

export default function HomePage({ setPage }: HomePageProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
              Global Tax Planning, <span className="text-primary">Powered by AI.</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-8 max-w-2xl">
              Upload financial documents. Get actionable, AI-driven tax strategies for the US, UK, Canada & India.
            </h2>
            <p className="max-w-2xl text-lg text-gray-600 mb-10">
              Stop manual data entry. Our AI reads your ITR, Form 1040, P&L statements, and balance sheets to uncover hidden savings for you, your small business, or your large enterprise.
            </p>
            <Button onClick={() => setPage('planner')} size="lg" className="px-10 py-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow">
              Start Your Free Analysis
            </Button>
          </div>
          <div className="relative hidden md:block">
             <Image 
                src="https://placehold.co/600x400.png"
                alt="Tax documents and charts illustration" 
                width={600} 
                height={400} 
                className="rounded-xl shadow-2xl"
                data-ai-hint="finance abstract"
             />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">A Unified Platform for Total Tax Efficiency</h2>
            <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">From individual filings to multi-crore enterprises, our AI provides clarity and unlocks potential savings.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard title="For Individuals" icon={<FileText className="h-6 w-6 text-primary" />}>
              Upload your Form 1040 (US) or ITR-V (India). Our AI analyzes your salary, capital gains, and deductions to maximize your personal tax savings.
            </FeatureCard>
            <FeatureCard title="For Businesses" icon={<BarChart className="h-6 w-6 text-primary" />}>
              Submit your P&L and Balance Sheet. Get strategies on depreciation (like Section 179 in the US), business expenses, and entity structure optimization.
            </FeatureCard>
            <FeatureCard title="For Corporations" icon={<Globe className="h-6 w-6 text-primary" />}>
              Our AI provides insights on advanced topics like transfer pricing, MAT (India), R&D credits (US), and international tax treaties.
            </FeatureCard>
          </div>
        </div>
      </section>
    </>
  );
}
