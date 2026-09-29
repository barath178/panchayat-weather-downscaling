'use client';

// "Field instrument" primitives: numbered section heads, scale bars, north arrows and the
// telemetry strip. Shared by the dashboard and mirrored 1:1 in the Figma plugin (design/figma-plugin).

import React from 'react';

/** Editorial section opener: (01) kicker, poster-scale serif title, and a short standfirst on the right. */
export function SectionHead({
  index,
  kicker,
  title,
  meta,
  id,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  meta?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          ({index}) <span className="mx-1.5 text-line/40">—</span> {kicker}
        </div>
        <h2 id={id} className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
          {title}
        </h2>
      </div>
      {meta && <p className="max-w-sm text-[15px] leading-relaxed text-ink2 lg:col-span-4 lg:justify-self-end">{meta}</p>}
    </div>
  );
}

/** Fades content up once it scrolls into view. */
export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** Alternating black/white scale bar, e.g. 0 ── 6 km */
export function ScaleBar({ km, widthPct, className = '' }: { km: number; widthPct: number; className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ width: `${widthPct}%` }}>
      <div className="flex h-1.5 overflow-hidden rounded-[1px] border border-white/70">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`flex-1 ${i % 2 ? 'bg-white/85' : 'bg-black/60'}`} />
        ))}
      </div>
      <div className="mt-0.5 flex justify-between font-mono text-[9px] leading-none text-white/85 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
        <span>0</span>
        <span>{km} km</span>
      </div>
    </div>
  );
}

export function NorthArrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 28" className={`pointer-events-none h-7 w-5 drop-shadow ${className}`} aria-label="North">
      <path d="M10 2 L16 18 L10 14.5 L4 18 Z" fill="rgba(255,255,255,0.9)" />
      <path d="M10 2 L10 14.5 L4 18 Z" fill="rgba(0,0,0,0.35)" />
      <text x="10" y="27" textAnchor="middle" fontSize="7.5" fontFamily="ui-monospace, monospace" fill="rgba(255,255,255,0.9)">
        N
      </text>
    </svg>
  );
}

export interface Telemetry {
  status: 'live' | 'loading' | 'offline' | 'scenario';
  source: string;
  updated: string | null;
  lat: number;
  lng: number;
  elevationM: number;
  cellElevationM: number;
  dem: 'dem' | 'synthetic' | 'loading';
  regions: number;
}

const STATUS: Record<Telemetry['status'], [string, string]> = {
  live: ['LIVE', 'bg-good'],
  loading: ['SYNC', 'bg-warn animate-pulse'],
  offline: ['OFFLINE', 'bg-alert'],
  scenario: ['SIM', 'bg-sky'],
};

/** Thin live ticker above the navigation: data source, run time, position and grid, scrolling. */
export function TelemetryStrip({ t }: { t: Telemetry }) {
  const [label, dot] = STATUS[t.status];
  const dz = t.elevationM - t.cellElevationM;
  const items: [string, string][] = [
    ['NWP', t.source],
    ['Updated', t.updated ?? '—'],
    ['Position', `${t.lat.toFixed(3)}°N ${t.lng.toFixed(3)}°E`],
    ['Elevation', `${t.elevationM.toLocaleString('en-IN')} m a.s.l.`],
    ['NWP cell', `${Math.round(t.cellElevationM).toLocaleString('en-IN')} m`],
    ['Δz', `${dz >= 0 ? '+' : '−'}${Math.abs(Math.round(dz))} m`],
    ['DEM', t.dem === 'dem' ? 'Copernicus GLO-90 · 225 cells' : t.dem === 'loading' ? 'loading…' : 'offline model'],
    ['Grid', '18 km → 1.2 km'],
    ['Coverage', `${t.regions} regions`],
  ];
  const run = (k: string) => (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={k === 'b'}>
      {items.map(([name, v]) => (
        <span key={name + k} className="text-white/45">
          {name} <span className="text-white/80">{v}</span>
        </span>
      ))}
      <span className="text-[#D4F25A]">✦</span>
    </div>
  );
  return (
    <div className="night relative flex items-center overflow-hidden bg-[#0B110E] font-mono text-[10.5px] uppercase tracking-[0.12em]">
      <span className="relative z-10 flex shrink-0 items-center gap-1.5 bg-[#0B110E] py-2 pl-4 pr-4 font-semibold text-white sm:pl-8">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} /> {label}
      </span>
      <div className="ticker flex w-max py-2">
        {run('a')}
        {run('b')}
      </div>
    </div>
  );
}
