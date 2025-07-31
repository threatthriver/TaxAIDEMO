'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

type HeaderProps = {
  setPage: (page: 'home' | 'planner') => void;
};

export default function Header({ setPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const Logo = () => (
    <div
      className="text-2xl font-bold text-gray-800 cursor-pointer flex items-center gap-2"
      onClick={() => {
        setPage('home');
        setIsMenuOpen(false);
      }}
    >
      <span className="text-primary">Tax</span>
      <span>Planner AI</span>
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
        className="text-gray-600 hover:text-primary font-semibold transition-colors"
      >
        Planner Suite
      </a>
      <a href="#" className="text-gray-600 hover:text-primary font-semibold transition-colors">Solutions</a>
      <a href="#" className="text-gray-600 hover:text-primary font-semibold transition-colors">Pricing</a>
    </>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />
        <div className="hidden md:flex items-center space-x-8">{navLinks}</div>
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-primary hover:text-primary">Client Login</Button>
          <Button>Request a Demo</Button>
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
                  <Button variant="ghost" className="text-primary hover:text-primary">Client Login</Button>
                  <Button>Request a Demo</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
