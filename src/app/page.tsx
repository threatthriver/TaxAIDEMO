'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HomePage from '@/components/pages/home-page';
import TaxPlannerPage from '@/components/pages/tax-planner-page';

export default function Home() {
  const [page, setPage] = useState<'home' | 'planner'>('home');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header setPage={setPage} />
      <main>
        {page === 'home' && <HomePage setPage={setPage} />}
        {page === 'planner' && <TaxPlannerPage />}
      </main>
      <Footer />
    </div>
  );
}
