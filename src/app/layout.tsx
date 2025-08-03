import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'TaxAI',
  description: 'Global Tax Planning, Powered by AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`font-sans antialiased`}>
        <Header />
        <main className="pt-24">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
