'use client';

import { ReactNode } from 'react';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { BackToTop } from './back-to-top';

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
