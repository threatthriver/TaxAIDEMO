'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const Logo = () => (
    <Link
      href="/"
      className="text-2xl font-bold cursor-pointer flex items-center gap-2"
      onClick={() => setIsMenuOpen(false)}
    >
      <ShieldCheck className="h-8 w-8 text-primary"/>
      <span className="text-foreground">Tax</span>
      <span className="font-light text-muted-foreground">AI</span>
    </Link>
  );

  const navLinks = (
    <>
      <Link
        href="/planner"
        onClick={() => setIsMenuOpen(false)}
        className="text-muted-foreground hover:text-primary font-medium transition-colors"
      >
        Tax Planner
      </Link>
      <Link href="/solutions" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-primary font-medium transition-colors">Solutions</Link>
      <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-primary font-medium transition-colors">Pricing</Link>
      <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-muted-foreground hover:text-primary font-medium transition-colors">About</Link>
    </>
  );

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      isScrolled ? "bg-card/80 backdrop-blur-lg border-b" : "bg-transparent"
    )}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />
        <div className="hidden md:flex items-center space-x-8">{navLinks}</div>
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost">Log In</Button>
          <Button>Sign Up Free</Button>
        </div>
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="p-4">
                <div className="mb-8">
                  <Logo />
                </div>
                <div className="flex flex-col space-y-6 text-lg">{navLinks}</div>
                <div className="mt-8 flex flex-col space-y-4">
                  <Button variant="ghost">Log In</Button>
                  <Button>Sign Up Free</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
