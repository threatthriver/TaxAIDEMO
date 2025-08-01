
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const Logo = () => (
    <Link
      href="/"
      className="text-2xl font-bold cursor-pointer flex items-center gap-2"
      onClick={() => setIsMenuOpen(false)}
    >
      <ShieldCheck className="h-8 w-8" style={{ color: 'hsl(var(--primary))' }}/>
      <span className="text-foreground">TaxAI</span>
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
    <header className="fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-300">
       <nav className={cn(
        "container mx-auto px-6 py-3 flex justify-between items-center rounded-full border transition-all duration-500",
        "bg-card/80 backdrop-blur-lg shadow-lg border-border/20",
       )}>
        <Logo />
        <div className="hidden md:flex items-center space-x-8">{navLinks}</div>
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="rounded-full">Log In</Button>
          <Button className="rounded-full">Sign Up Free</Button>
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
                  <Button variant="ghost" className="rounded-full">Log In</Button>
                  <Button className="rounded-full">Sign Up Free</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
