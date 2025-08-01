
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

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
                    <Card className="shadow-lg hover:shadow-xl transition-shadow animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <CardHeader>
                            <CardTitle className="text-2xl">For Individuals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground text-lg">Optimize your personal finances and maximize your tax returns with our intuitive tools.</p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary"/> W-2 & 1099 Analysis</li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary"/> Investment & Capital Gains</li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary"/> Deduction Finder</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 border-primary animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                        <CardHeader>
                            <CardTitle className="text-2xl">For Small Businesses / LLCs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground text-lg">Streamline your business taxes, from expense tracking to payroll and profit analysis.</p>
                             <ul className="space-y-2">
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary"/> P&L and Balance Sheet Analysis</li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary"/> Expense Categorization</li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary"/> Quarterly Tax Estimates</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                        <CardHeader>
                            <CardTitle className="text-2xl">For Corporations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <p className="text-muted-foreground text-lg">Comprehensive tax planning for complex corporate structures and multi-entity enterprises.</p>
                             <ul className="space-y-2">
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary"/> Multi-Year Strategic Planning</li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary"/> R&D Tax Credits</li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary"/> International Tax Analysis</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
