'use client';

import React, { useEffect } from 'react';
import { X, CloudRain, Mountain, Cpu, Users, Sprout } from 'lucide-react';

const STEPS = [
  { icon: CloudRain, title: '1 · Coarse forecast', text: 'Live Open-Meteo NWP grid-cell forecast (~11–25 km), the same scale as IMD block forecasts.' },
  { icon: Mountain, title: '2 · Terrain physics', text: 'SRTM elevation lapse rate, D8 cold-air drainage, orographic lift, wind-gap funnelling, urban heat island.' },
  { icon: Cpu, title: '3 · 1.2 km microclimate', text: 'Panchayat-level temperature, rain, wind and humidity, plus hourly spray windows and FAO-56 ET₀.' },
  { icon: Users, title: '4 · Farmer delivery', text: 'English/Hindi/Tamil WhatsApp advisories, voice read-out, village kiosk wallboard, PMFBY claim evidence.' },
];

const STACK = [
  ['Frontend', 'Next.js 14, React 18, Tailwind CSS, Recharts, Leaflet'],
  ['Backend', 'FastAPI (Python), XGBoost / Random Forest downscaler'],
  ['Data', 'Open-Meteo NWP, NASA SRTM 30 m DEM, IMD INSAT-3DR imagery'],
  ['Storage', 'Supabase PostgreSQL + PostGIS (GIST spatial index)'],
];

export default function AboutModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in"
      >
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 id="about-title" className="font-display text-xl font-extrabold text-white">AeroAgro AI</h2>
            <p className="text-xs text-slate-400">Hyper-local weather for every Gram Panchayat</p>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 mb-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1">The problem</div>
          <p className="text-sm text-slate-200 leading-relaxed">
            Official forecasts are issued per block or district on grids of 12–25 km. One number covers ridges, valleys, cities and
            river deltas alike, so a frost hollow, a rain-shadow village and a hillside tea estate all get the same advice. Farmers
            spray before rain, miss frost nights, and cannot prove localized crop losses for insurance.
          </p>
        </div>

        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-2">How it works</div>
        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
                <Icon className="w-4 h-4 text-emerald-400" /> {title}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5 text-center">
          {[
            ['303', 'districts & metros'],
            ['225×', 'finer cells than an 18 km grid'],
            ['₹0', 'API cost (open data)'],
          ].map(([v, l]) => (
            <div key={l} className="rounded-2xl bg-black/30 border border-white/5 p-3">
              <div className="text-2xl font-black text-white">{v}</div>
              <div className="text-[11px] text-slate-400">{l}</div>
            </div>
          ))}
        </div>

        <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-2">Tech stack</div>
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-xs mb-5">
          {STACK.map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="text-slate-400 w-16 shrink-0">{k}</dt>
              <dd className="text-slate-200">{v}</dd>
            </div>
          ))}
        </dl>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Downscaled values are physics-based estimates for decision support and are not an official IMD forecast. The “Live Today”
          mode fetches real forecasts; the other scenarios are climatological simulations for demonstration.
        </p>
      </div>
    </div>
  );
}
