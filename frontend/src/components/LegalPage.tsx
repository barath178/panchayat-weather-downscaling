import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from './CommandBar';

export const LEGAL_UPDATED = '29 September 2026';
export const REPO = 'https://github.com/barath178/panchayat-weather-downscaling';

/** Plain reading layout shared by the Privacy and Terms pages. */
export default function LegalPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line/[0.1]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="AeroAgro AI home">
            <Logo className="h-8 w-8" />
            <span className="font-display text-2xl leading-none text-ink">
              AeroAgro<span className="italic text-accent"> AI</span>
            </span>
          </Link>
          <Link href="/" className="btn-ghost h-10 px-4">
            <ArrowLeft className="h-4 w-4" /> Back to the forecast
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 lg:py-20">
        <p className="text-xs font-medium text-muted">Last updated {LEGAL_UPDATED}</p>
        <h1 className="mt-4 font-display text-6xl leading-none text-ink">{title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink2">{intro}</p>
        <div className="legal mt-12">{children}</div>
      </main>
      <footer className="border-t border-line/[0.1]">
        <nav className="mx-auto flex max-w-3xl flex-wrap gap-6 px-5 py-8 text-sm text-ink2 sm:px-8" aria-label="Legal">
          <Link href="/privacy/" className="hover:text-accent">
            Privacy
          </Link>
          <Link href="/terms/" className="hover:text-accent">
            Terms
          </Link>
          <a href={REPO} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            Source code
          </a>
        </nav>
      </footer>
    </div>
  );
}
