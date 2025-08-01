
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const pricingTiers = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'For individuals and freelancers getting started.',
    features: [
      'Analyze up to 50 documents',
      'Individual analysis',
      'Basic strategies',
      'Email support'
    ],
    cta: 'Choose Starter'
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/month',
    description: 'For small businesses and growing professionals.',
    features: [
      'Analyze up to 200 documents',
      'Business & individual analysis',
      'Advanced strategies & "what-if"',
      'Priority email & chat support'
    ],
    cta: 'Choose Pro',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    period: '',
    description: 'For large corporations and accounting firms.',
    features: [
      'Unlimited document analysis',
      'Multi-entity & multi-year plans',
      'Dedicated account manager',
      'API Access & Integrations'
    ],
    cta: 'Contact Sales'
  }
];

export default function PricingPage() {
    return (
        <div className="bg-background min-h-screen py-20 md:py-32">
            <div className="container mx-auto px-4 sm:px-6">
                 <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
                        Find the Right Plan for You
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Simple, transparent pricing. No hidden fees.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {pricingTiers.map((tier, index) => (
                        <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-2 border-primary shadow-2xl' : 'shadow-lg'} animate-fade-in-up`} style={{animationDelay: `${index * 0.2}s`}}>
                            <CardHeader>
                                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                                <CardDescription>{tier.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                    <span className="text-muted-foreground">{tier.period}</span>
                                </div>
                                <ul className="space-y-3">
                                    {tier.features.map(feature => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <Check className="h-5 w-5 text-green-500" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant={tier.popular ? 'default' : 'outline'}>{tier.cta}</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
