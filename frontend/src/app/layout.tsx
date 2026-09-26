import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AeroAgro AI - Block to Panchayat Weather Downscaling & Agromet Advisory Platform',
  description: 'Precision Agro-Meteorological Advisory Platform with Physics-Informed ML Microclimate Downscaling, MapLibre GL 3D vector maps, and ICAR-aligned Smart Spray Windows.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
