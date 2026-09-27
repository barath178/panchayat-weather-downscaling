'use client';

import React, { useEffect } from 'react';
import { X, CloudRain, Mountain, Cpu, Users } from 'lucide-react';
import { Logo } from './CommandBar';

const STEPS = [
  { icon: CloudRain, title: 'Coarse forecast', text: 'Live Open-Meteo forecast for the ~11–25 km grid cell — the same scale as IMD block forecasts.' },
  { icon: Mountain, title: 'Terrain physics', text: 'Elevation lapse rate, cold-air drainage into valleys, orographic lift, wind gaps and urban heat.' },
  { icon: Cpu, title: '1.2 km microclimate', text: 'Village-level temperature, rain, wind and humidity, hourly spray windows and crop water demand.' },
  { icon: Users, title: 'Farmer delivery', text: 'WhatsApp advisories in English, हिन्दी and தமிழ், voice read-out, village kiosk and insurance evidence.' },
];

const STACK: [string, string][] = [
  ['Frontend', 'Next.js 14 · React · Tailwind · Recharts · Leaflet'],
  ['Backend', 'FastAPI · XGBoost / Random Forest downscaler'],
  ['Data', 'Open-Meteo · NASA SRTM 30 m · IMD INSAT-3DR'],
  ['Storage', 'Supabase PostgreSQL + PostGIS'],
];

export default function AboutModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        onClick={(e) => e.stopPropagation()}
        className="card relative max-h-[90vh] w-full max-w-3xl overflow-y-auto p-6 shadow-pop animate-fade-in sm:p-10"
      >
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-lg p-1.5 text-muted hover:bg-raised hover:text-ink">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <div>
            <h2 id="about-title" className="font-display text-2xl text-ink">
              AeroAgro AI
            </h2>
            <p className="text-sm text-muted">Weather for your village, not your district.</p>
          </div>
        </div>

        <p className="mt-6 font-display text-xl leading-snug text-ink sm:text-2xl">
          Forecasts are issued for 12–25 km squares. A frost hollow, a rain-shadow village and a hillside tea estate in the same square all get the same number.
        </p>
        <p className="mt-3 text-ink2">
          Farmers spray just before rain, miss frost nights, and cannot prove local crop losses for insurance. AeroAgro fixes the resolution problem with physics, then turns
          the answer into plain advice.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="rounded-2xl bg-surface2 p-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-xs font-bold text-accent">{i + 1}</span>
                <span className="flex items-center gap-2 font-semibold text-ink">
                  <Icon className="h-4 w-4 text-ink2" /> {title}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink2">{text}</p>
            </div>
          ))}
        </div>

        <dl className="mt-8 grid gap-x-8 gap-y-2 border-t border-line/10 pt-6 text-sm sm:grid-cols-2">
          {STACK.map(([k, v]) => (
            <div key={k} className="flex gap-3">
              <dt className="w-20 shrink-0 text-muted">{k}</dt>
              <dd className="text-ink2">{v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-xs leading-relaxed text-muted">
          Downscaled values are physics-based estimates for decision support, not an official IMD forecast. “Live today” uses real forecasts; the other scenarios are
          simulations for demonstration.
        </p>
      </div>
    </div>
  );
}
