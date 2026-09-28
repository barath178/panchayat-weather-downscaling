import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CSP_META } from '@/lib/security';

// "Monsoon Almanac" type system: poster serif for the story, tight grotesk for reading, mono for measured numbers.
const display = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
const sans = Inter_Tight({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'AeroAgro AI · Weather for your village, not your district',
  description:
    'Downscales 18 km block forecasts to 1.2 km Gram Panchayat microclimates using terrain physics, and turns them into spray windows, irrigation advice, pest alerts and PMFBY claim evidence for farmers.',
  openGraph: {
    title: 'AeroAgro AI',
    description: 'Hyper-local weather and crop advisories for every Gram Panchayat in India.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#F3EFE6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        {/* Same policy as the vercel.json header, for hosts that cannot send headers (GitHub Pages). Dev needs eval for HMR. */}
        {process.env.NODE_ENV === 'production' && <meta httpEquiv="Content-Security-Policy" content={CSP_META} />}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
