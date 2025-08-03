
'use client';

import type { AnalyzeTaxDocumentOutput } from '@/ai/flows/analyze-tax-document';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Bot, User, X } from 'lucide-react';
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
    const [hasStartedChat, setHasStartedChat] = useState(false);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user' as const, content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const chatHistory = newMessages;
            const response = await chatWithReport({
                analysisResult,
                chatHistory
            });
             if (response) {
                setMessages(prev => [...prev, { role: 'model' as const, content: response }]);
             } else {
                throw new Error("Received an empty response from the assistant.");
             }
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Chat Error',
                description: 'Failed to get a response from the assistant.',
            });
             setMessages(prev => prev.slice(0, -1)); // remove optimistic user message on failure
        } finally {
            setLoading(false);
            if (!hasStartedChat) {
                setHasStartedChat(true);
            }
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
                    <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                             <Bot />
                             <div>
                                <CardTitle className="text-lg">AI Financial Assistant</CardTitle>
                                <CardDescription className="text-xs text-primary-foreground/80">Ask questions about your report</CardDescription>
                             </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-white/20" onClick={() => setIsOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full" ref={scrollAreaRef}>
                            <div className="p-4 space-y-4">
                                {!hasStartedChat && (
                                    <div className="text-center text-muted-foreground p-4 border rounded-lg bg-muted/50 text-sm">
                                        <p>Have questions about your plan? Ask me anything about the strategies, figures, or next steps.</p>
                                    </div>
                                )}
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
                className="rounded-full w-16 h-16 shadow-lg flex items-center justify-center"
                aria-label="Open chat assistant"
            >
                <MessageSquare className="h-8 w-8" />
            </Button>
        </div>
    );
};

export default ChatAssistant;
