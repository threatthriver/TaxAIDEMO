
'use client';

import type { AnalyzeTaxDocumentOutput } from '@/ai/flows/analyze-tax-document';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { chatWithReport } from '@/ai/flows/chat-with-report';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { ScrollArea } from './ui/scroll-area';

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
        if (isOpen && messages.length > 0) {
            const scrollableArea = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if(scrollableArea) {
                scrollableArea.scrollTo({
                    top: scrollableArea.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    }, [messages, isOpen]);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <Card className="w-96 h-[60vh] flex flex-col shadow-2xl rounded-xl border-2 border-primary/20">
                    <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
                        <CardTitle className="text-lg flex items-center gap-2">
                           <Bot /> AI Financial Assistant
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full" ref={scrollAreaRef}>
                            <div className="p-4 space-y-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                        {msg.role === 'model' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                                        <div className={`rounded-lg px-4 py-2 max-w-xs text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                            {msg.content}
                                        </div>
                                         {msg.role === 'user' && <User className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex items-start gap-3">
                                        <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                                        <div className="rounded-lg px-4 py-2 max-w-xs text-sm bg-secondary text-secondary-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
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
                className="rounded-full w-20 h-20 shadow-lg flex items-center justify-center"
            >
                <MessageSquare className="h-10 w-10" />
            </Button>
        </div>
    );
};

export default ChatAssistant;
