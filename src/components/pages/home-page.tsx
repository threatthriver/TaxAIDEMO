'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

type HomePageProps = {
  setPage: (page: 'planner') => void;
};

const FeatureCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="bg-white p-2 text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader>
      <div className="mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
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
      <section className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Global Tax Planning, Powered by AI
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-8 max-w-4xl mx-auto">
            Upload financial documents. Get actionable, AI-driven tax strategies for the US, UK, Canada & India.
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-10">
            Stop manual data entry. Our AI reads your ITR, Form 1040, P&L statements, and balance sheets to uncover hidden savings for you, your small business, or your large enterprise.
          </p>
          <Button onClick={() => setPage('planner')} size="lg" className="px-8 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow">
            Start Your Analysis
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">A Unified Platform for Total Tax Efficiency</h2>
            <p className="text-xl text-muted-foreground mt-2">From individual filings to multi-crore enterprises.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard title="For Individuals">
              Upload your Form 1040 (US) or ITR-V (India). Our AI analyzes your salary, capital gains, and deductions to maximize your personal tax savings.
            </FeatureCard>
            <FeatureCard title="For Small & Medium Businesses">
              Submit your P&L and Balance Sheet. Get strategies on depreciation (like Section 179 in the US), business expenses, and entity structure optimization.
            </FeatureCard>
            <FeatureCard title="For Large Corporations">
              Our AI provides insights on advanced topics like transfer pricing, MAT (India), R&D credits (US), and international tax treaties to ensure compliance and savings.
            </FeatureCard>
          </div>
        </div>
      </section>
    </>
  );
}
