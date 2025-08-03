
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, User, Briefcase, Building2 } from "lucide-react";

const solutions = [
    {
        icon: <User className="h-8 w-8 text-primary"/>,
        title: "For Individuals",
        description: "Optimize your personal finances and maximize your tax returns with our intuitive tools.",
        features: ["W-2 & 1099 Analysis", "Investment & Capital Gains", "Deduction Finder"],
    },
    {
        icon: <Briefcase className="h-8 w-8 text-primary"/>,
        title: "For Small Businesses / LLCs",
        description: "Streamline your business taxes, from expense tracking to payroll and profit analysis.",
        features: ["P&L and Balance Sheet Analysis", "Expense Categorization", "Quarterly Tax Estimates"],
        highlight: true
    },
    {
        icon: <Building2 className="h-8 w-8 text-primary"/>,
        title: "For Corporations",
        description: "Comprehensive tax planning for complex corporate structures and multi-entity enterprises.",
        features: ["Multi-Year Strategic Planning", "R&D Tax Credits", "International Tax Analysis"],
    }
]

export default function SolutionsPage() {
    return (
        <div className="bg-background min-h-screen py-20 md:py-32">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
                        Tailored Solutions for Everyone
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Whether you're an individual, a small business owner, or a large corporation, TaxAI has a solution designed for your unique needs.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {solutions.map((solution, index) => (
                        <Card 
                            key={solution.title} 
                            className={`bg-card/60 shadow-none border-0 transition-shadow animate-scale-in ${solution.highlight ? 'ring-2 ring-primary' : ''}`} 
                            style={{animationDelay: `${index * 0.2}s`, animationFillMode: 'both'}}
                        >
                            <CardHeader className="text-center">
                                <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                                   {solution.icon}
                                </div>
                                <CardTitle className="text-2xl">{solution.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground text-center text-lg">{solution.description}</p>
                                <ul className="space-y-2 pt-4 border-t">
                                    {solution.features.map(feature => (
                                       <li key={feature} className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary"/>{feature}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
