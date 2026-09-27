import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AeroAgro AI · Panchayat-level weather downscaling',
  description:
    'Downscales 18 km block forecasts to 1.2 km Gram Panchayat microclimates using terrain physics, and turns them into spray windows, irrigation advice, pest alerts and PMFBY claim evidence for farmers.',
  openGraph: {
    title: 'AeroAgro AI',
    description: 'Hyper-local weather and crop advisories for every Gram Panchayat in India.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#080a11',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
