'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShieldCheck } from 'lucide-react';

type HeaderProps = {
  setPage: (page: 'home' | 'planner') => void;
};

export default function Header({ setPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const Logo = () => (
    <div
      className="text-2xl font-bold cursor-pointer flex items-center gap-2"
      onClick={() => {
        setPage('home');
        setIsMenuOpen(false);
      }}
    >
      <ShieldCheck className="h-8 w-8 text-primary"/>
      <span className="text-foreground">Tax</span>
      <span className="font-light text-muted-foreground">AI</span>
    </div>
  );

  const navLinks = (
    <>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setPage('planner');
          setIsMenuOpen(false);
        }}
        className="text-muted-foreground hover:text-primary font-medium transition-colors"
      >
        Tax Planner
      </a>
      <a href="#" className="text-muted-foreground hover:text-primary font-medium transition-colors">Solutions</a>
      <a href="#" className="text-muted-foreground hover:text-primary font-medium transition-colors">Pricing</a>
      <a href="#" className="text-muted-foreground hover:text-primary font-medium transition-colors">About</a>
    </>
  );

  return (
    <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-50">
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
