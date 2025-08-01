
'use client';
import { ShieldCheck, Target, Users } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen">
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 text-center animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4">
                        About TaxAI
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                        We are a team of financial experts and technologists dedicated to simplifying tax planning through the power of artificial intelligence.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="animate-fade-in-up">
                         <Image
                            src="https://images.unsplash.com/photo-1554224155-1696413565d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxmaW5hbmNlJTIwdGVhbXxlbnwwfHx8fDE3NTM5NjQ5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Our team collaborating"
                            width={600}
                            height={400}
                            className="rounded-xl shadow-2xl"
                            data-ai-hint="finance team"
                         />
                    </div>
                    <div className="space-y-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Target className="h-8 w-8 text-primary"/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Our Mission</h2>
                                <p className="text-muted-foreground mt-2 text-lg">To empower individuals and businesses to take control of their financial future by providing accessible, intelligent, and personalized tax planning tools.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <ShieldCheck className="h-8 w-8 text-primary"/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Our Vision</h2>
                                <p className="text-muted-foreground mt-2 text-lg">To become the leading platform for automated financial planning, building a future where complex financial decisions are made with clarity and confidence.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Users className="h-8 w-8 text-primary"/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Our Values</h2>
                                <p className="text-muted-foreground mt-2 text-lg">We are committed to integrity, innovation, and customer-centricity. We strive to build a product that is not only powerful but also trustworthy and secure.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
