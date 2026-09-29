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
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-accent">
          <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono">{index}</span> {kicker}
        </div>
        <h2 id={id} className="mt-2.5 text-[28px] font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[32px]">
          {title}
        </h2>
      </div>
      {meta && <p className="max-w-md text-sm leading-relaxed text-muted lg:text-right">{meta}</p>}
    </div>
  );
}

/** Section wrapper. Content is static on purpose: no scroll-triggered motion. */
export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
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

/** Thin status strip above the navigation: data source, run time, position and grid. Static; swipe to see more on small screens. */
export function TelemetryStrip({ t }: { t: Telemetry }) {
  const [label, dot] = STATUS[t.status];
  const dz = t.elevationM - t.cellElevationM;
  const items: [string, string][] = [
    ['NWP', t.source],
    ['Updated', t.updated ?? 'n/a'],
    ['Position', `${t.lat.toFixed(3)}°N ${t.lng.toFixed(3)}°E`],
    ['Elevation', `${t.elevationM.toLocaleString('en-IN')} m a.s.l.`],
    ['NWP cell', `${Math.round(t.cellElevationM).toLocaleString('en-IN')} m`],
    ['Δz', `${dz >= 0 ? '+' : '−'}${Math.abs(Math.round(dz))} m`],
    ['DEM', t.dem === 'dem' ? 'Copernicus GLO-90 · 225 cells' : t.dem === 'loading' ? 'loading…' : 'offline model'],
    ['Grid', '18 km → 1.2 km'],
    ['Coverage', `${t.regions} regions`],
  ];
  return (
    <div className="night relative flex items-center overflow-hidden bg-[#0B110E] font-mono text-[10.5px] uppercase tracking-[0.12em]">
      <span className="relative z-10 flex shrink-0 items-center gap-1.5 bg-[#0B110E] py-2 pl-4 pr-4 font-semibold text-white sm:pl-8">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} /> {label}
      </span>
      <div className="scrollbar-none flex min-w-0 items-center gap-8 overflow-x-auto whitespace-nowrap py-2 pr-8">
        {items.map(([name, v]) => (
          <span key={name} className="text-white/45">
            {name} <span className="text-white/80">{v}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
