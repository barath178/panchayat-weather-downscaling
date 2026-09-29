import type { Metadata, Viewport } from 'next';
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', axes: ['opsz', 'SOFT'], display: 'swap' });
const sans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
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
  themeColor: '#0A0E0C',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
